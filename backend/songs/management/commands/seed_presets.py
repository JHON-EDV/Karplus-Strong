from django.core.management.base import BaseCommand
from songs.models import Song


class Command(BaseCommand):
    help = 'Seed the database with preset songs'

    def handle(self, *args, **options):
        presets = [
            {
                'title': 'C Major Scale',
                'bpm': 120,
                'decay_factor': 0.996,
                'description_en': 'A simple C major scale from C4 to C5.',
                'description_es': 'Una escala de DO mayor simple de DO4 a DO5.',
                'data': {
                    'notes': [
                        {'pitch': 60, 'startBeat': 0, 'duration': 1, 'velocity': 0.8},
                        {'pitch': 62, 'startBeat': 1, 'duration': 1, 'velocity': 0.8},
                        {'pitch': 64, 'startBeat': 2, 'duration': 1, 'velocity': 0.8},
                        {'pitch': 65, 'startBeat': 3, 'duration': 1, 'velocity': 0.8},
                        {'pitch': 67, 'startBeat': 4, 'duration': 1, 'velocity': 0.8},
                        {'pitch': 69, 'startBeat': 5, 'duration': 1, 'velocity': 0.8},
                        {'pitch': 71, 'startBeat': 6, 'duration': 1, 'velocity': 0.8},
                        {'pitch': 72, 'startBeat': 7, 'duration': 1, 'velocity': 0.8},
                    ]
                },
            },
            {
                'title': 'MATLAB Demo Song',
                'bpm': 120,
                'decay_factor': 0.996,
                'description_en': 'The original melody from the MATLAB DSP course project.',
                'description_es': 'La melodía original del proyecto del curso de DSP en MATLAB.',
                'data': {
                    'notes': self._build_matlab_notes()
                },
            },
        ]

        created_count = 0
        for preset_data in presets:
            _, created = Song.objects.get_or_create(
                title=preset_data['title'],
                is_preset=True,
                defaults=preset_data,
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created preset: {preset_data["title"]}'))
            else:
                self.stdout.write(f'Preset already exists: {preset_data["title"]}')

        self.stdout.write(self.style.SUCCESS(f'Done. {created_count} new preset(s) created.'))

    @staticmethod
    def _build_matlab_notes():
        note_map = {
            'DO': 60, 'RE': 62, 'MI': 64, 'FA': 65, 'SOL': 67,
            'LA': 69, 'SI': 71, 'DO2': 72, 'RE2': 74, 'MI2': 76,
            'SOL2': 79, 'LA2': 81,
        }
        raw = [
            'SOL', 'MI', 'MI', 'FA', 'RE', 'RE', 'DO', 'RE', 'MI', 'FA',
            'SOL', 'SOL', 'SOL', 'SOL', 'MI', 'MI', 'FA', 'RE', 'RE', 'DO',
            'MI', 'SOL', 'SOL', 'MI', 'MI', 'MI', 'RE', 'RE', 'MI', 'RE',
            'DO', 'MI', 'SOL', 'SOL', 'MI', 'MI', 'FA', 'RE', 'RE', 'DO',
            'MI', 'SOL', 'SOL', 'MI', 'MI', 'MI', 'MI', 'FA', 'FA', 'FA',
            'FA', 'FA', 'MI', 'FA', 'SOL', 'SOL', 'MI', 'MI', 'FA', 'RE',
            'RE', 'DO', 'RE', 'MI', 'FA', 'SOL', 'SOL', 'SOL', 'SOL', 'MI',
            'MI', 'FA', 'RE', 'RE', 'DO', 'MI', 'SOL', 'SOL', 'MI', 'MI',
            'MI', 'RE', 'RE', 'RE',
        ]
        return [
            {
                'pitch': note_map.get(name, 60),
                'startBeat': i * 0.75,
                'duration': 0.7,
                'velocity': 0.8,
            }
            for i, name in enumerate(raw)
        ]
