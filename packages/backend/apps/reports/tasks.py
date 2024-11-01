# reports/tasks.py
from celery import shared_task
from .models import ReportRun
from django.utils import timezone

@shared_task
def run_report_task(report_run_id):
    report_run = ReportRun.objects.get(id=report_run_id)
    try:
        # Simulate report generation
        generated_report_content = b"Generated report content here"  # Placeholder content

        # Update the report run with output information
        report_run.report_output = generated_report_content
        report_run.status = 'completed'
        report_run.completed_at = timezone.now()
        report_run.save()
    except Exception as e:
        report_run.status = 'failed'
        report_run.save()
        raise e
