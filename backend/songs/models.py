from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Song(models.Model):
    """A user composition or preset song with note data."""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='songs',
        help_text='Owner of the song. Null for presets.',
    )
    title = models.CharField(
        max_length=200,
        default='Untitled Song',
        help_text='Display title of the song.',
    )
    bpm = models.IntegerField(
        default=120,
        validators=[MinValueValidator(30), MaxValueValidator(300)],
        help_text='Beats per minute (30–300).',
    )
    decay_factor = models.FloatField(
        default=0.996,
        validators=[MinValueValidator(0.9), MaxValueValidator(0.999)],
        help_text='KS decay multiplier (0.9–0.999). Closer to 1 = slower decay.',
    )
    data = models.JSONField(
        default=dict,
        help_text='Song data including notes array.',
    )
    is_preset = models.BooleanField(
        default=False,
        help_text='Whether this song is a built-in preset.',
    )
    description_en = models.TextField(blank=True, default='')
    description_es = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'song'
        verbose_name_plural = 'songs'

    def __str__(self):
        return self.title

    def get_description(self, lang='en'):
        """Get description in the specified language, falling back to English."""
        return getattr(self, f'description_{lang}', self.description_en) or self.description_en
