# Karplus-Strong Synthesizer

A bilingual (Spanish/English) web application for learning and composing music using the Karplus-Strong plucked string synthesis algorithm.

## Architecture

```
┌─────────────┐       REST API       ┌──────────────┐       ┌────────────┐
│   Frontend   │ ──────────────────► │   Backend    │ ────► │ PostgreSQL │
│   (nginx)    │ ◄────────────────── │   (Django)   │ ◄──── │            │
│   Port 3000  │       JSON          │   Port 8000  │       └────────────┘
└─────────────┘                      └──────────────┘
```

**Frontend**: Vanilla JS served by nginx — Canvas API for piano roll, Web Audio API for synthesis, no build step.

**Backend**: Django 6.0 + Django REST Framework — JWT auth, paginated API, preset songs.

## Features

- **Interactive Learning**: 7-section tutorial with live audio demos, spectrum visualization, and editable parameters
- **Piano Roll Editor**: Canvas-based grid editor for composing melodies with 16th-note precision
- **Karplus-Strong Synthesis**: Pure JavaScript implementation matching the original MATLAB algorithm, plus advanced parameters (pluck position, stiffness, body resonance, brightness)
- **REST API**: Full CRUD for songs with JWT authentication, pagination, search, and filtering
- **Bilingual**: Complete Spanish/English support with instant language switching
- **Preset Songs**: C Major Scale and MATLAB Demo Song seeded via management command

## Quick Start

### With Docker

```bash
docker compose up
```

- Frontend: http://localhost:3000
- API: http://localhost:8000/api/v1/

### Without Docker

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_presets
python manage.py runserver

# Frontend — open frontend/index.html in your browser
```

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/health/` | No | Health check |
| `POST` | `/api/v1/auth/register/` | No | Register user, returns JWT |
| `POST` | `/api/v1/auth/token/` | No | Login, returns JWT pair |
| `POST` | `/api/v1/auth/token/refresh/` | No | Refresh access token |
| `GET` | `/api/v1/songs/` | Yes | List user's songs (paginated) |
| `POST` | `/api/v1/songs/` | Yes | Create a song |
| `GET` | `/api/v1/songs/{id}/` | Yes | Retrieve a song |
| `PATCH` | `/api/v1/songs/{id}/` | Yes | Update a song |
| `DELETE` | `/api/v1/songs/{id}/` | Yes | Delete a song |
| `GET` | `/api/v1/songs/presets/` | No | List preset songs (public) |

### Example: Create a Song

```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "securepass123"}'

# Create song (use the access token from register response)
curl -X POST http://localhost:8000/api/v1/songs/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Song",
    "bpm": 120,
    "decay_factor": 0.996,
    "data": {"notes": [{"pitch": 60, "startBeat": 0, "duration": 1}]}
  }'
```

## The Algorithm

The Karplus-Strong algorithm synthesizes plucked string sounds in 3 steps:

1. **Noise burst**: Generate N random samples where N = sample_rate / frequency
2. **Ring buffer**: Loop the samples in a circular buffer
3. **Averaging filter**: Each pass replaces each sample with the average of itself and the next: `Y[i] = (Y[i] + Y[i+1]) / d`

The decay factor `d` controls how quickly the sound fades. Values near 2.0 produce long sustain; higher values fade faster.

## Tech Stack

- **Backend**: Django 6.0, Django REST Framework, SimpleJWT, django-filter, django-environ, WhiteNoise, Gunicorn
- **Frontend**: Vanilla JavaScript, Canvas API, Web Audio API (Tone.js)
- **Database**: PostgreSQL (production), SQLite (development)
- **Infrastructure**: Docker, nginx, Railway

## Project Structure

```
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── karplus_project/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── songs/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── admin.py
│       ├── management/commands/seed_presets.py
│       └── tests/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── learn.html
│   ├── compose.html
│   ├── css/style.css
│   └── js/
│       ├── config.js
│       ├── app.js
│       ├── i18n/strings.js
│       ├── audio/synth.js
│       ├── pianoroll/editor.js
│       ├── api/client.js
│       ├── compose/controller.js
│       └── learn/controller.js
├── docker-compose.yml
├── LICENSE
└── README.md
```

## Deployment (Railway)

1. Create a new Railway project from this repo
2. Add two services: `backend` (root: `backend/`) and `frontend` (root: `frontend/`)
3. Add a PostgreSQL plugin and connect it to the backend
4. Set backend environment variables:
   - `SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`
   - `DJANGO_SETTINGS_MODULE=karplus_project.settings.production`
5. Set frontend environment variable: `BACKEND_URL=https://your-backend.railway.app`
6. Backend release command: `python manage.py migrate && python manage.py seed_presets`
7. Backend health check: `/api/v1/health/`

## License

MIT
