import logging
import mimetypes
import requests
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.decorators import action
from django.http import HttpResponse, JsonResponse
from .models import ReportTemplate, ReportRun, Tenant
from .serializers import ReportTemplateSerializer, ReportRunSerializer
from .tasks import run_report_task
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

logger = logging.getLogger(__name__)

class ReportTemplateViewSet(viewsets.ModelViewSet):
    queryset = ReportTemplate.objects.all()
    serializer_class = ReportTemplateSerializer

    @action(detail=True, methods=['get'], url_path='download')
    def download(self, request, pk=None):
        template = ReportTemplate.objects.get(id=pk)
        
        if not template.file:
            logger.error(f"No file found for report template ID {pk}.")
            return Response({"error": "File not found."}, status=status.HTTP_404_NOT_FOUND)

        response = HttpResponse(template.file, content_type="application/octet-stream")
        response['Content-Disposition'] = f'attachment; filename="{template.name + mimetypes.guess_extension(template.file_type)}"'
        
        logger.info(f"File for report template ID {pk} served as download.")
        return response
    
    def create(self, request, *args, **kwargs):
        template_data =  request.data.get('file')
        template_type =  request.data.get('file_type')
        logger.info(template_data)
        logger.info(request)
        tenant = request.data.get('tenant')
        tenant_instance = Tenant.objects.get(id=tenant)
        template = ReportTemplate.objects.create(
            name=request.data.get('name'),
            description=request.data.get('description'),
            file=template_data,
            file_type=template_type,
            created_by=request.user,
            tenant=tenant_instance
        )
        return Response({"template_id": template.id}, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        template = ReportTemplate.objects.get(id=pk)
        json_file = request.FILES.get('json_file')

        report_run = ReportRun.objects.create(
            template=template,
            user=request.user,
            status='started',
            tenant=template.tenant
        )
        #run_report_task.delay(report_run.id)
        api_url = "http://172.19.0.2:80/ReportBuilder/generate"
        output_filename = f"{template.name}_output"

        # Prepare files as tuples (name, file, MIME type)
        office_file = (template.name, template.file, template.file_type)
        data_file = (json_file.name, json_file, 'application/json')

        # Call the utility function
        return self.call_report_generation_api(api_url, office_file, data_file, output_filename)
    
    @action(detail=False, methods=['post'], url_path='run')
    def run_with_file(self, request):
        """
        Custom action to generate a report by directly providing a JSON file and office file.
        """
        office_file = request.FILES.get('office_file')
        json_file = request.FILES.get('json_file')

        # Check if files are provided
        if not office_file or not json_file:
            return Response(
                {"error": "Both office file and JSON file are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Define the external API URL
        api_url = "http://172.19.0.3:80/ReportBuilder/generate"
        output_filename = office_file.name.split('.')[0] + "_output"

        # Prepare files as tuples (name, file, MIME type)
        office_file_tuple = (office_file.name, office_file, office_file.content_type)
        json_file_tuple = (json_file.name, json_file, 'application/json')

        # Call the utility function
        return self.call_report_generation_api(api_url, office_file_tuple, json_file_tuple, output_filename)

    def call_report_generation_api(self, api_url, office_file, data_file, output_filename):
        """
        Calls the external API to generate a report and returns the API response.

        :param api_url: URL of the external API.
        :param office_file: Tuple containing the office file's name, file object, and MIME type.
        :param data_file: Tuple containing the JSON file's name, file object, and MIME type.
        :param output_filename: Name for the output file in the response.
        :return: HttpResponse or JsonResponse containing the generated report or error.
        """
        files = {
            'officeFile': office_file,
            'dataFile': data_file
        }
        
        params = {
            'isPdfConversion': 'false',
            'outputFileName': output_filename
        }

        try:
            response = requests.post(api_url, files=files, params=params, verify=False)  # `verify=False` for self-signed SSL
            response.raise_for_status()

            # Process the file returned from the external API
            content_disposition = response.headers.get('content-disposition')
            if content_disposition:
                filename = content_disposition.split('filename=')[-1].strip().split(';')[0].strip('"')
                return HttpResponse(
                    response.content,
                    content_type=response.headers['content-type'],
                    headers={'Content-Disposition': f'attachment; filename="{filename}"'}
                )
            else:
                return JsonResponse(response.json(), status=response.status_code)

        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": "An error occurred while generating the report.", "details": str(e)}, status=500)


class ReportRunViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ReportRun.objects.all()
    serializer_class = ReportRunSerializer

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download the generated report output for a specific run"""
        report_run = self.get_object()
        if report_run.output_file:
            response = Response(report_run.output_file, content_type="application/octet-stream")
            response['Content-Disposition'] = f'attachment; filename="report_{report_run.id}.bin"'
            return response
        else:
            return Response({"error": "Report output not found"}, status=status.HTTP_404_NOT_FOUND)
