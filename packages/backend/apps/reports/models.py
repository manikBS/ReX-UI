import hashid_field
from django.db import models
from django.conf import settings

from apps.multitenancy.models import Tenant
from django.core.validators import FileExtensionValidator

class ReportTemplate(models.Model):
    id = hashid_field.HashidAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file = models.BinaryField()
    file_type = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class ReportRun(models.Model):
    id = hashid_field.HashidAutoField(primary_key=True)
    template = models.ForeignKey(ReportTemplate, on_delete=models.CASCADE, related_name='report_runs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=[('started', 'Started'), ('completed', 'Completed'), ('failed', 'Failed')])
    output_file = models.BinaryField(blank=True, null=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)

    def __str__(self):
        return f"Run of {self.template.name} by {self.user} (Status: {self.status})"
