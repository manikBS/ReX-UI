from django.db import models
from django.conf import settings

class ReportTemplate(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    template_data = models.BinaryField()  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    #created_by = settings.AUTH_USER_MODEL = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class ReportRun(models.Model):
    #template = models.ForeignKey(ReportTemplate, on_delete=models.CASCADE, related_name='report_runs')
    #user = settings.AUTH_USER_MODEL = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=[('started', 'Started'), ('completed', 'Completed'), ('failed', 'Failed')])
    output_file = models.BinaryField(blank=True, null=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Run of {self.template.name} by {self.user} (Status: {self.status})"
