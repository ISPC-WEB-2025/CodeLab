from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Usuario, Role


class JWTAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.role_admin = Role.objects.create(
            nombre="ADMINISTRADOR", descripcion="Administrador general"
        )
        self.role_vendedor = Role.objects.create(
            nombre="VENTAS", descripcion="Vendedor de salón"
        )
        self.admin_user = Usuario.objects.create_user(
            email="admin@test.com",
            nombre="Admin Test",
            dni="12345678",
            fecha_nacimiento="1990-01-01",
            password="adminpassword123",
            rol=self.role_admin,
            is_staff=True,
            is_superuser=True,
        )
        self.vendedor_user = Usuario.objects.create_user(
            email="vendedor@test.com",
            nombre="Vendedor Test",
            dni="87654321",
            fecha_nacimiento="1995-05-15",
            password="vendedorpassword123",
            rol=self.role_vendedor,
        )

    def test_login_returns_jwt_tokens(self):
        response = self.client.post(
            "/api/usuarios/login/",
            {"email": "admin@test.com", "password": "adminpassword123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["nombre"], "Admin Test")
        self.assertTrue(response.data["es_admin"])

    def test_token_refresh_endpoint(self):
        login_resp = self.client.post(
            "/api/usuarios/login/",
            {"email": "vendedor@test.com", "password": "vendedorpassword123"},
            format="json",
        )
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)
        refresh_token = login_resp.data["refresh"]

        refresh_resp = self.client.post(
            "/api/usuarios/token/refresh/",
            {"refresh": refresh_token},
            format="json",
        )
        self.assertEqual(refresh_resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_resp.data)

    def test_protected_endpoint_with_bearer_token(self):
        login_resp = self.client.post(
            "/api/usuarios/login/",
            {"email": "admin@test.com", "password": "adminpassword123"},
            format="json",
        )
        access_token = login_resp.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        response = self.client.get("/api/usuarios/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_protected_endpoint_rejects_invalid_token(self):
        self.client.credentials(HTTP_AUTHORIZATION="Bearer invalid_token_12345")
        response = self.client.get("/api/usuarios/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
