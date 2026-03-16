from django.contrib import admin
from .models import Song


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ['title', 'bpm', 'decay_factor', 'is_preset', 'user', 'created_at']
    list_filter = ['is_preset', 'created_at']
    search_fields = ['title']
    readonly_fields = ['created_at', 'updated_at']
