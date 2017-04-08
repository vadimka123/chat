from django.contrib import admin

from message.models import Message


class MessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'room', 'sended', 'message',)
    search_fields = ('message',)


admin.site.register(Message, MessageAdmin)
