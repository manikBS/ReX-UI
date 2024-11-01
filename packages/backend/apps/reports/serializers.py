# reports/serializers.py
from rest_framework import serializers
from .models import ReportTemplate, ReportRun

class ReportTemplateSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)  # Accepts file input for upload

    class Meta:
        model = ReportTemplate
        fields = ['id', 'name', 'description', 'file', 'created_at', 'updated_at']

    def create(self, validated_data):
        file = validated_data.pop('file')
        validated_data['template_data'] = file.read()  # Store file content as binary
        return super().create(validated_data)

class ReportRunSerializer(serializers.ModelSerializer):
    report_output = serializers.SerializerMethodField()

    class Meta:
        model = ReportRun
        fields = ['id', 'template', 'status', 'report_output', 'started_at', 'completed_at']

    def get_report_output(self, obj):
        return obj.report_output.decode('utf-8') if obj.report_output else None
