from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from songs.models import Song


class SongModelTests(TestCase):
    def test_create_song(self):
        song = Song.objects.create(title='Test Song', bpm=120, decay_factor=0.996)
        self.assertEqual(str(song), 'Test Song')
        self.assertFalse(song.is_preset)

    def test_default_ordering(self):
        Song.objects.create(title='First')
        Song.objects.create(title='Second')
        songs = list(Song.objects.values_list('title', flat=True))
        self.assertEqual(songs, ['Second', 'First'])

    def test_get_description_english(self):
        song = Song.objects.create(description_en='Hello', description_es='Hola')
        self.assertEqual(song.get_description('en'), 'Hello')

    def test_get_description_spanish(self):
        song = Song.objects.create(description_en='Hello', description_es='Hola')
        self.assertEqual(song.get_description('es'), 'Hola')

    def test_get_description_fallback(self):
        song = Song.objects.create(description_en='Hello', description_es='')
        self.assertEqual(song.get_description('es'), 'Hello')

    def test_bpm_min_validation(self):
        song = Song(title='Bad BPM', bpm=10, decay_factor=0.996)
        with self.assertRaises(ValidationError):
            song.full_clean()

    def test_bpm_max_validation(self):
        song = Song(title='Bad BPM', bpm=500, decay_factor=0.996)
        with self.assertRaises(ValidationError):
            song.full_clean()

    def test_decay_factor_min_validation(self):
        song = Song(title='Bad Decay', bpm=120, decay_factor=0.5)
        with self.assertRaises(ValidationError):
            song.full_clean()

    def test_decay_factor_max_validation(self):
        song = Song(title='Bad Decay', bpm=120, decay_factor=1.5)
        with self.assertRaises(ValidationError):
            song.full_clean()

    def test_user_relationship(self):
        user = User.objects.create_user(username='testuser', password='testpass123')
        song = Song.objects.create(title='My Song', user=user)
        self.assertEqual(song.user, user)
        self.assertIn(song, user.songs.all())
