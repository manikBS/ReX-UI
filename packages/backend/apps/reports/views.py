# reports/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import ReportTemplate, ReportRun
from .serializers import ReportTemplateSerializer, ReportRunSerializer
from .tasks import run_report_task

class ReportTemplateViewSet(viewsets.ModelViewSet):
    queryset = ReportTemplate.objects.all()
    serializer_class = ReportTemplateSerializer

    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        """Trigger the report generation task for this template"""
        template = self.get_object()
        report_run = ReportRun.objects.create(
            template=template,
            status='started'
        )
        run_report_task.delay(report_run.id)
        return Response({"status": "report generation started"}, status=status.HTTP_202_ACCEPTED)

class ReportRunViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ReportRun.objects.all()
    serializer_class = ReportRunSerializer

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download the generated report output for a specific run"""
        report_run = self.get_object()
        if report_run.report_output:
            response = Response(report_run.report_output, content_type="application/octet-stream")
            response['Content-Disposition'] = f'attachment; filename="report_{report_run.id}.bin"'
            return response
        else:
            return Response({"error": "Report output not found"}, status=status.HTTP_404_NOT_FOUND)
