import logging
from rest_framework import serializers
from hashid_field import rest as hidrest
from .models import ReportTemplate, ReportRun
from apps.users.models import User
from apps.multitenancy.models import Tenant

logger = logging.getLogger(__name__)

class ReportTemplateSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)
    
    id = hidrest.HashidSerializerCharField(
        source_field="reports.ReportTemplate.id", read_only=True
    )

    created_by = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        pk_field=hidrest.HashidSerializerCharField(),
        write_only=True,
    )

    tenant = serializers.PrimaryKeyRelatedField(
        queryset=Tenant.objects.all(),
        pk_field=hidrest.HashidSerializerCharField(),
        write_only=True,
    )

    class Meta:
        model = ReportTemplate
        fields = ['id', 'name', 'description', 'file', 'created_at', 'updated_at', 'created_by', 'tenant']

    def create(self, validated_data):
        file = validated_data.pop('file')
        validated_data['file_type'] = file.content_type
        validated_data['file'] = file.read()
        return super().create(validated_data)

class ReportRunSerializer(serializers.ModelSerializer):
    report_output = serializers.SerializerMethodField()
    id = hidrest.HashidSerializerCharField(
        source_field="reports.ReportRun.id", read_only=True
    )

    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        pk_field=hidrest.HashidSerializerCharField(),
        write_only=True,
    )

    class Meta:
        model = ReportRun
        fields = ['id', 'user', 'template', 'status', 'report_output', 'started_at', 'completed_at']

    def get_report_output(self, obj):
        return obj.report_output.decode('utf-8') if obj.report_output else None
