from rest_framework import serializers
from .models import Review
import spacy
import re
nlp = spacy.load("en_core_web_sm")


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ['id', 'predicted_rating', 'created_at', 'updated_at']

    def validate_text(self, value):
        if not value or not isinstance(value, str):
            raise serializers.ValidationError("Text must be a non-empty string.")

        value = value.strip()

        if len(value) < 5:
            raise serializers.ValidationError("Text must be at least 5 characters long.")

        special_chars = re.sub(r'[a-zA-Z0-9\s.,!?]', '', value)
        special_char_ratio = len(special_chars) / len(value) if len(value) > 0 else 0
        max_special_char_ratio = 0.3
        if special_char_ratio > max_special_char_ratio:
            raise serializers.ValidationError(
                f"Text contains too many special characters ({special_char_ratio:.0%}). "
                f"Maximum allowed is {max_special_char_ratio:.0%}."
            )

        doc = nlp(value)

        meaningful_tokens = [token for token in doc if token.pos_ in ["NOUN", "VERB", "ADJ"]]
        if not meaningful_tokens:
            raise serializers.ValidationError(
                "Text must contain at least one noun, verb, or adjective to be meaningful.")

        return value