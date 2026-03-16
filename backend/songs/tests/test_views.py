from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from songs.models import Song


class HealthCheckTests(TestCase):
    def test_health_check(self):
        client = APIClient()
        response = client.get('/api/v1/health/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'ok'})


class RegisterTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_success(self):
        response = self.client.post('/api/v1/auth/register/', {
            'username': 'newuser',
            'password': 'securepass123',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.json())
        self.assertIn('refresh', response.json())
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_register_duplicate_username(self):
        User.objects.create_user(username='taken', password='pass12345')
        response = self.client.post('/api/v1/auth/register/', {
            'username': 'taken',
            'password': 'securepass123',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_short_password(self):
        response = self.client.post('/api/v1/auth/register/', {
            'username': 'user2',
            'password': 'short',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_empty_username(self):
        response = self.client.post('/api/v1/auth/register/', {
            'username': '',
            'password': 'securepass123',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TokenTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')

    def test_obtain_token(self):
        response = self.client.post('/api/v1/auth/token/', {
            'username': 'testuser',
            'password': 'testpass123',
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.json())
        self.assertIn('refresh', response.json())

    def test_refresh_token(self):
        token_response = self.client.post('/api/v1/auth/token/', {
            'username': 'testuser',
            'password': 'testpass123',
        })
        refresh = token_response.json()['refresh']
        response = self.client.post('/api/v1/auth/token/refresh/', {
            'refresh': refresh,
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.json())


class SongViewSetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.other_user = User.objects.create_user(username='other', password='testpass123')

    def _auth(self, user=None):
        user = user or self.user
        self.client.force_authenticate(user=user)

    def _song_data(self, **overrides):
        data = {
            'title': 'My Song',
            'bpm': 120,
            'decay_factor': 0.996,
            'data': {'notes': [{'pitch': 60, 'startBeat': 0, 'duration': 1}]},
        }
        data.update(overrides)
        return data

    def test_anonymous_cannot_create(self):
        response = self.client.post('/api/v1/songs/', self._song_data(), format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_can_create(self):
        self._auth()
        response = self.client.post('/api/v1/songs/', self._song_data(), format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        song = Song.objects.get(id=response.json()['id'])
        self.assertEqual(song.user, self.user)

    def test_user_sees_only_own_songs(self):
        self._auth()
        self.client.post('/api/v1/songs/', self._song_data(title='Mine'), format='json')
        self._auth(self.other_user)
        self.client.post('/api/v1/songs/', self._song_data(title='Theirs'), format='json')
        response = self.client.get('/api/v1/songs/')
        titles = [s['title'] for s in response.json()['results']]
        self.assertEqual(titles, ['Theirs'])

    def test_user_cannot_delete_others_song(self):
        self._auth()
        response = self.client.post('/api/v1/songs/', self._song_data(), format='json')
        song_id = response.json()['id']
        self._auth(self.other_user)
        response = self.client.delete(f'/api/v1/songs/{song_id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_is_paginated(self):
        self._auth()
        for i in range(25):
            Song.objects.create(title=f'Song {i}', user=self.user)
        response = self.client.get('/api/v1/songs/')
        data = response.json()
        self.assertIn('results', data)
        self.assertIn('count', data)
        self.assertEqual(data['count'], 25)
        self.assertEqual(len(data['results']), 20)

    def test_search_by_title(self):
        self._auth()
        Song.objects.create(title='Blues in C', user=self.user)
        Song.objects.create(title='Rock Anthem', user=self.user)
        response = self.client.get('/api/v1/songs/', {'search': 'Blues'})
        results = response.json()['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], 'Blues in C')

    def test_create_invalid_returns_400(self):
        self._auth()
        response = self.client.post('/api/v1/songs/', {
            'title': 'Bad',
            'bpm': 9999,
            'decay_factor': 0.996,
            'data': {},
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_own_song(self):
        self._auth()
        response = self.client.post('/api/v1/songs/', self._song_data(), format='json')
        song_id = response.json()['id']
        response = self.client.patch(
            f'/api/v1/songs/{song_id}/',
            {'title': 'Updated Title'},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['title'], 'Updated Title')


class PresetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Song.objects.create(title='Scale', is_preset=True, data={'notes': []})
        Song.objects.create(title='User Song', is_preset=False)

    def test_presets_public_no_auth(self):
        response = self.client.get('/api/v1/songs/presets/')
        self.assertEqual(response.status_code, 200)
        titles = [s['title'] for s in response.json()]
        self.assertEqual(titles, ['Scale'])

    def test_presets_not_in_user_list(self):
        user = User.objects.create_user(username='u', password='testpass123')
        self.client.force_authenticate(user=user)
        response = self.client.get('/api/v1/songs/')
        titles = [s['title'] for s in response.json()['results']]
        self.assertNotIn('Scale', titles)
