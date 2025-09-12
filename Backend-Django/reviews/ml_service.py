from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification
import os
import torch
import json
from django.conf import settings
from sklearn.preprocessing import LabelEncoder
import numpy as np


_model = None
_tokenizer = None
_label_encoder = None
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def load_model():
    global _model, _tokenizer, _label_encoder

    if _model is None or _tokenizer is None or _label_encoder is None:
        model_dir = os.path.join(settings.BASE_DIR, "ml_models")

        # ✅ Initialize model with correct number of labels (match training setup)
        _model = DistilBertForSequenceClassification.from_pretrained(
            "distilbert-base-uncased",
            num_labels=5   # <-- change if your model was trained with different #labels
        )

        # ✅ Load fine-tuned weights
        state_dict = torch.load(
            os.path.join(model_dir, "best_model.pt"),
            map_location=_device
        )
        _model.load_state_dict(state_dict, strict=False)
        _model.to(_device)
        _model.eval()

        # ✅ Load tokenizer (make sure tokenizer.json + vocab.txt exist in ml_models/)
        _tokenizer = DistilBertTokenizerFast.from_pretrained(model_dir)

        # ✅ Load label encoder safely (optional, can be removed if bypassing)
        label_encoder_path = os.path.join(model_dir, "label_encoder.json")
        with open(label_encoder_path, "r") as f:
            label_data = json.load(f)

        le = LabelEncoder()

        if "classes" in label_data:
            le.classes_ = label_data["classes"]
        else:
            sorted_items = sorted(label_data.items(), key=lambda x: x[1])
            le.classes_ = [float(k) for k, _ in sorted_items]
            print(f"Loaded label encoder classes: {le.classes_}")

        _label_encoder = le
    return _model, _tokenizer, _label_encoder


def predict_rating(text: str) -> float:
    """Predict rating (float) for a given review text."""
    print(f"Processing text: {text}")
    if not isinstance(text, str) or not text.strip():
        raise ValueError("Text must be a non-empty string")
    model, tokenizer, _ = load_model()  # Ignore label_encoder if bypassing

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    ).to(_device)

    with torch.no_grad():
        outputs = model(**inputs)
        pred_class = torch.argmax(outputs.logits, dim=1).cpu().item()
        print(f"Predicted class index: {pred_class}")
    rating = float(pred_class + 1.0)
    print(f"Rating after direct mapping: {rating}")
    return rating