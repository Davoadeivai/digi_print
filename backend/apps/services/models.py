from django.db import models
from django.utils.translation import gettext_lazy as _

class Service(models.Model):
    """Model representing a service offered by the company"""
    name = models.CharField(_('name'), max_length=200)
    slug = models.SlugField(_('slug'), max_length=200, unique=True)
    description = models.TextField(_('description'), blank=True)
    price = models.DecimalField(_('price'), max_digits=10, decimal_places=0)
    is_active = models.BooleanField(_('is active'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    class Meta:
        verbose_name = _('service')
        verbose_name_plural = _('services')
        ordering = ('name',)
    def __str__(self):
        return self.name