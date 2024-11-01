import logging
import mimetypes
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.decorators import action
from django.http import HttpResponse
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
        """Trigger the report generation task for this template or upload a file to run"""
        template_id = request.data.get('template_id')
        file = request.FILES.get('file')

        if template_id:
            template = ReportTemplate.objects.get(id=template_id)
        elif file:
            template_data = file.read()
            tenant = request.data.get('tenant')
            tenant_instance = Tenant.objects.get(id=tenant)
            template = ReportTemplate.objects.create(
                name="Temporary Template",
                file=template_data,
                created_by=request.user,
                tenant=tenant_instance
            )
        else:
            return Response({"error": "Either template_id or file is required"}, status=status.HTTP_400_BAD_REQUEST)

        report_run = ReportRun.objects.create(
            template=template,
            user=request.user,
            status='started',
            tenant=template.tenant
        )
        run_report_task.delay(report_run.id)
        return Response({"status": "Report generation started"}, status=status.HTTP_202_ACCEPTED)

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
