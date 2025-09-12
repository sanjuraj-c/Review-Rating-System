from rest_framework import generics
from .models import Review
from .serializers import ReviewSerializer
from .ml_service import predict_rating

class ReviewListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset = Review.objects.all()

        sort_by = self.request.query_params.get("sort_by", None)
        if sort_by == "created":
            queryset = queryset.order_by("-created_at")
        elif sort_by == "updated":
            queryset = queryset.order_by("-updated_at")

        rating = self.request.query_params.get("rating", None)
        if rating is not None:
            try:
                rating = float(rating)
                queryset = queryset.filter(predicted_rating=rating)
            except ValueError:
                pass

        rating_gte = self.request.query_params.get("rating_gte", None)
        if rating_gte is not None:
            try:
                rating_gte = float(rating_gte)
                queryset = queryset.filter(predicted_rating__gte=rating_gte)
            except ValueError:
                pass

        rating_lte = self.request.query_params.get("rating_lte", None)
        if rating_lte is not None:
            try:
                rating_lte = float(rating_lte)
                queryset = queryset.filter(predicted_rating__lte=rating_lte)
            except ValueError:
                pass

        return queryset


    def perform_create(self, serializer):
        review_text = serializer.validated_data.get("text", "")

        predicted = 0
        predicted = predict_rating(review_text)
        serializer.save(predicted_rating=predicted)   
