from django.db import models

class Review(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)  #
    text = models.TextField()
    predicted_rating = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)    

    def __str__(self):
        display_name = self.name if self.name else "Anonymous"
        return f"{display_name}: {self.text[:30]}... ({self.predicted_rating})"
