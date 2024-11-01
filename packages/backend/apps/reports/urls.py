# reports/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportTemplateViewSet, ReportRunViewSet

router = DefaultRouter()
router.register(r'report-templates', ReportTemplateViewSet, basename='report-template')
router.register(r'report-runs', ReportRunViewSet, basename='report-run')

urlpatterns = [
    path('', include(router.urls)),
]
