from django.contrib import admin
from .models import ReportTemplate, ReportRun
from django import forms
from django.contrib import admin

class ReportTemplateForm(forms.ModelForm):
    file_upload = forms.FileField(required=False, help_text="Upload a file for template data")

    class Meta:
        model = ReportTemplate
        fields = ['name', 'description', 'file_upload', 'created_by', 'tenant']

    def save(self, commit=True):
        instance = super().save(commit=False)
        uploaded_file = self.cleaned_data.get('file_upload')
        
        # Save uploaded file content to template_data if provided
        if uploaded_file:
            instance.file_type = uploaded_file.content_type
            instance.file = uploaded_file.read()
        if commit:
            instance.save()
        return instance

@admin.register(ReportTemplate)
class ReportTemplateAdmin(admin.ModelAdmin):
    form = ReportTemplateForm

    def save_model(self, request, obj, form, change):
        # Use custom save to handle file upload
        if form.cleaned_data.get("file_upload"):
            obj.template_data = form.cleaned_data["file_upload"].read()
        super().save_model(request, obj, form, change)

@admin.register(ReportRun)
class ReportRunAdmin(admin.ModelAdmin):
    list_display = ('id', 'template', 'user', 'tenant', 'status', 'started_at', 'completed_at')
