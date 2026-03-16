from rest_framework import serializers
from .models import Song


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = [
            'id', 'title', 'bpm', 'decay_factor', 'data',
            'is_preset', 'description_en', 'description_es',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'is_preset', 'created_at', 'updated_at']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Title cannot be empty.')
        return value.strip()

    def validate_data(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError('Data must be a JSON object.')
        notes = value.get('notes')
        if notes is not None:
            if not isinstance(notes, list):
                raise serializers.ValidationError('notes must be an array.')
            for i, note in enumerate(notes):
                if not isinstance(note, dict):
                    raise serializers.ValidationError(f'Note at index {i} must be an object.')
                for field in ('pitch', 'startBeat', 'duration'):
                    if field not in note:
                        raise serializers.ValidationError(
                            f'Note at index {i} is missing required field "{field}".'
                        )
                pitch = note['pitch']
                if not isinstance(pitch, int) or pitch < 0 or pitch > 127:
                    raise serializers.ValidationError(
                        f'Note at index {i}: pitch must be an integer 0–127.'
                    )
                if not isinstance(note['startBeat'], (int, float)) or note['startBeat'] < 0:
                    raise serializers.ValidationError(
                        f'Note at index {i}: startBeat must be >= 0.'
                    )
                if not isinstance(note['duration'], (int, float)) or note['duration'] <= 0:
                    raise serializers.ValidationError(
                        f'Note at index {i}: duration must be > 0.'
                    )
        return value
