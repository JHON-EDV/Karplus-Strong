"""WSGI config for karplus_project."""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'karplus_project.settings.development')

application = get_wsgi_application()
