FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN DJANGO_SETTINGS_MODULE=karplus_project.settings.production \
    SECRET_KEY=build-placeholder \
    ALLOWED_HOSTS=placeholder \
    CORS_ALLOWED_ORIGINS=https://placeholder \
    DATABASE_URL=sqlite:///tmp/build.db \
    python manage.py collectstatic --noinput

EXPOSE 8000

CMD gunicorn karplus_project.wsgi:application --bind 0.0.0.0:${PORT:-8000}
