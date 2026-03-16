from django.test import TestCase
from songs.serializers import SongSerializer


class SongSerializerTests(TestCase):
    def _valid_data(self, **overrides):
        data = {
            'title': 'Test Song',
            'bpm': 120,
            'decay_factor': 0.996,
            'data': {'notes': [{'pitch': 60, 'startBeat': 0, 'duration': 1}]},
        }
        data.update(overrides)
        return data

    def test_valid_data(self):
        s = SongSerializer(data=self._valid_data())
        self.assertTrue(s.is_valid(), s.errors)

    def test_empty_title_rejected(self):
        s = SongSerializer(data=self._valid_data(title='   '))
        self.assertFalse(s.is_valid())
        self.assertIn('title', s.errors)

    def test_bpm_out_of_range(self):
        s = SongSerializer(data=self._valid_data(bpm=500))
        self.assertFalse(s.is_valid())
        self.assertIn('bpm', s.errors)

    def test_decay_out_of_range(self):
        s = SongSerializer(data=self._valid_data(decay_factor=2.0))
        self.assertFalse(s.is_valid())
        self.assertIn('decay_factor', s.errors)

    def test_is_preset_read_only(self):
        s = SongSerializer(data=self._valid_data(is_preset=True))
        self.assertTrue(s.is_valid(), s.errors)
        # is_preset should be ignored (read-only)
        song = s.save()
        self.assertFalse(song.is_preset)

    def test_invalid_data_not_dict(self):
        s = SongSerializer(data=self._valid_data(data='not a dict'))
        self.assertFalse(s.is_valid())

    def test_invalid_note_missing_pitch(self):
        s = SongSerializer(data=self._valid_data(
            data={'notes': [{'startBeat': 0, 'duration': 1}]}
        ))
        self.assertFalse(s.is_valid())
        self.assertIn('data', s.errors)

    def test_invalid_note_pitch_out_of_range(self):
        s = SongSerializer(data=self._valid_data(
            data={'notes': [{'pitch': 200, 'startBeat': 0, 'duration': 1}]}
        ))
        self.assertFalse(s.is_valid())

    def test_invalid_note_negative_duration(self):
        s = SongSerializer(data=self._valid_data(
            data={'notes': [{'pitch': 60, 'startBeat': 0, 'duration': -1}]}
        ))
        self.assertFalse(s.is_valid())

    def test_empty_notes_array_valid(self):
        s = SongSerializer(data=self._valid_data(data={'notes': []}))
        self.assertTrue(s.is_valid(), s.errors)

    def test_data_without_notes_key_valid(self):
        s = SongSerializer(data=self._valid_data(data={}))
        self.assertTrue(s.is_valid(), s.errors)
