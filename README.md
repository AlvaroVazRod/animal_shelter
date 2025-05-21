# Documentación Técnica de la API - Protectora de Animales

## 1. Arquitectura General

Esta API está desarrollada con **Spring Boot** utilizando las siguientes capas:

- **Controller**: expone los endpoints REST.
- **Service**: contiene la lógica de negocio.
- **Repository**: accede a la base de datos mediante JPA.
- **DTO**: objetos de transferencia de datos validados.
- **Security**: autenticación basada en JWT con roles `ADMIN` y `USER`.
- **Exception Handler**: gestiona errores globales y validaciones con respuestas claras.

## 2. Seguridad con JWT

- Al iniciar sesión con `POST /auth/login`, se devuelve un JWT con el `username` y el `role`.
- El JWT debe enviarse en las peticiones protegidas en la cabecera:

  ```
  Authorization: Bearer <token>
  ```

- El token incluye:
  - `sub`: username
  - `role`: ADMIN o USER

## 3. Rutas Públicas (no requieren token)

| Método | Endpoint                | Descripción                        |
|--------|-------------------------|------------------------------------|
| GET    | /api/animales           | Lista todos los animales           |
| GET    | /api/animales/{id}      | Obtiene un animal por su ID        |
| POST   | /api/usuarios           | Registra un nuevo usuario          |

## 4. Rutas Protegidas (requieren autenticación)

### 4.1 Rutas de Animales (solo ADMIN para modificar)

| Método | Endpoint                | Rol requerido | Descripción                  |
|--------|-------------------------|----------------|------------------------------|
| POST   | /api/animales           | ADMIN         | Crear nuevo animal           |
| PUT    | /api/animales/{id}      | ADMIN         | Editar animal existente      |
| DELETE | /api/animales/{id}      | ADMIN         | Eliminar animal              |

### 4.2 Rutas de Usuarios

| Método | Endpoint                | Permisos                                   |
|--------|-------------------------|--------------------------------------------|
| GET    | /api/usuarios           | Solo ADMIN                                 |
| GET    | /api/usuarios/{id}      | ADMIN o el mismo usuario (`id`)            |
| PUT    | /api/usuarios/{id}      | ADMIN o el mismo usuario                   |
| DELETE | /api/usuarios/{id}      | ADMIN o el mismo usuario                   |

## 5. Validaciones

Todos los campos en los DTOs están validados:

- `@NotBlank`, `@Email`, `@Size`, `@Min`, etc.
- En caso de errores, se retorna una respuesta amigable por el `GlobalExceptionHandler`.

## 6. Manejador de Errores Global

Los errores de validación o lógica lanzan:

- `400 BAD REQUEST`: campos inválidos.
- `403 FORBIDDEN`: acceso denegado por rol o identidad.
- `404 NOT FOUND`: recurso no encontrado.

## 7. Autenticación

### Login
```
POST /auth/login
Body: { "username": "admin", "password": "adminpass" }
→ Response: { "token": "...", "role": "ADMIN" }
```

### Registro
```
POST /api/usuarios
Body: { "username": ..., "email": ..., "password": ... }
```

## 8. Swagger / Documentación API

Puedes acceder a la documentación visual en:

```
/swagger-ui/index.html
```

O importar el archivo OpenAPI en Postman.

---

© 2025 Protectora de Animales | Proyecto Fullstack Java + React