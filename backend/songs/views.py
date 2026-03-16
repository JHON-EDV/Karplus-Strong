from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Song
from .serializers import SongSerializer


class SongViewSet(viewsets.ModelViewSet):
    """
    CRUD for user songs.

    list/retrieve: authenticated users see their own songs.
    create/update/delete: authenticated only.
    presets: public, no auth needed.
    """

    serializer_class = SongSerializer
    search_fields = ['title']
    ordering_fields = ['created_at', 'title', 'bpm']
    filterset_fields = ['bpm']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Song.objects.filter(user=self.request.user, is_preset=False)
        return Song.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def presets(self, request):
        """Return all preset songs (public, no auth)."""
        presets = Song.objects.filter(is_preset=True)
        serializer = self.get_serializer(presets, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user and return JWT tokens."""
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not username:
        return Response(
            {'username': ['This field is required.']},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if not password or len(password) < 8:
        return Response(
            {'password': ['Password must be at least 8 characters.']},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if User.objects.filter(username=username).exists():
        return Response(
            {'username': ['A user with this username already exists.']},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.create_user(username=username, password=password)
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            'id': user.id,
            'username': user.username,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    """Health check endpoint for Railway."""
    return Response({'status': 'ok'})
