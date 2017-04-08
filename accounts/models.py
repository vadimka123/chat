from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser


class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None):
        if not username:
            raise ValueError(u'Users must have an email address')

        user = self.model(username=username,)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password):
        user = self.create_user(username=username, password=password)
        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser):
    username = models.CharField(max_length=255, unique=True, blank=False, null=False)

    objects = CustomUserManager()

    USERNAME_FIELD = u'username'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = u'User'
        verbose_name_plural = u'Users'

    def __unicode__(self):
        return unicode(self.username)

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    @staticmethod
    def is_staff():
        return True

    @staticmethod
    def has_perm(perm, obj=None):
        return True

    @staticmethod
    def has_module_perms(app_label):
        return True

CustomUser._meta.get_field('password').max_length = 256
