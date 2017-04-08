from django.contrib import admin

from room.models import Room


class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'private',)
    search_fields = ('name',)


admin.site.register(Room, RoomAdmin)
