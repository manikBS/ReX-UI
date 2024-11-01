# reports/admin.py
from django.contrib import admin
from .models import ReportTemplate, ReportRun

@admin.register(ReportTemplate)
class ReportTemplateAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)

@admin.register(ReportRun)
class ReportRunAdmin(admin.ModelAdmin):
    list_display = ('id', 'template', 'status', 'started_at', 'completed_at')
    search_fields = ('template__name', 'status')
    readonly_fields = ('template', 'started_at', 'completed_at', 'report_output')
    ordering = ('-started_at',)
    list_filter = ('status',)

    def has_add_permission(self, request):
        # Disallow adding ReportRun entries directly from the admin
        return False