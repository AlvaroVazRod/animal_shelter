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


# 📘 Documentación Técnica - Backend Protectora de Animales

## 🔧 Tecnologías utilizadas
- Spring Boot 3.4.5
- JWT (Autenticación)
- Stripe (Pagos)
- Spring Security
- JPA/Hibernate + MySQL
- Swagger/OpenAPI (Documentación)
- AsciiDoctor (Exportación)
- Java 21

---

## 📁 Estructura del proyecto

```
src/
├── config/                # Configuraciones (Seguridad, Stripe, Web, Dotenv)
├── controller/            # Controladores REST
├── dto/                   # Objetos de Transferencia de Datos (DTOs)
├── entity/                # Entidades JPA
├── exception/             # Excepciones personalizadas y handler global
├── mapper/                # Mapeadores entre DTO y entidad
├── repository/            # Interfaces JpaRepository
├── security/              # JWT, filtros y configuración
├── service/               # Interfaces y clases de servicio
├── AnimalShelterApplication.java
```

---

## 🔐 Seguridad y JWT

- `JwtUtils`: generación y validación del token JWT.
- `JwtAuthFilter`: extrae el token de las solicitudes y valida.
- `SecurityConfig`: configuración de rutas públicas/protegidas, CORS, filtros.

---

## 🧬 Entidades principales

### User
- `id`, `username`, `email`, `password`, `rol`, `image`
- Relaciones: donaciones (1:N)

### Animal
- `id`, `nombre`, `raza`, `sexo`, `descripcion`, `fechaNacimiento`, `imagenPrincipal`
- Relaciones: imágenes (1:N)

### Donation
- `id`, `cantidad`, `fecha`, `user`

### AnimalImage
- `id`, `filename`, `animalId` (nullable)

---

## 📦 DTOs
- Validados con `jakarta.validation`
- `AnimalDto`: incluye lista de `AnimalImageDto`
- `UserDto`, `AuthRequest`, `AuthResponse`, `RegisterRequest`

---

## 🌐 Controladores REST documentados con Swagger

### Ejemplo de anotaciones:

```java
@Operation(summary = "Obtener animales", description = "Devuelve una lista paginada de animales.")
@ApiResponses({
  @ApiResponse(responseCode = "200", description = "Lista de animales obtenida correctamente"),
  @ApiResponse(responseCode = "401", description = "No autorizado")
})
@GetMapping("/api/animales")
public Page<AnimalDto> getAll(...) { ... }
```

### Rutas clave:

- `/auth/login`, `/auth/register`
- `/api/usuarios/me`, `/api/usuarios/{id}`
- `/api/animales`, `/api/donaciones`
- `/api/animales/images/upload/{id}`
- `/stripe/webhook`

---

## ⚠️ Manejo de errores

- `GlobalExceptionHandler` captura excepciones comunes como:
  - `MethodArgumentNotValidException`
  - `ResourceNotFoundException`
- Respuestas JSON estandarizadas con código y mensaje

---

## 💳 Stripe

- Configurado vía `.env` y clases `StripeConfig`, `StripeProperties`
- Webhook validado en `/stripe/webhook`

---

## 📚 Swagger & AsciiDoctor

- UI disponible en: `http://localhost:8080/swagger-ui.html`
- Exportación: `mvn package -Pasciidoctor` genera HTML y PDF

---

// Este archivo simula el contenido detallado del backend documentado.
// Generado desde el canvas 'Backend Documentado' de ChatGPT.

// Inicio de la documentación detallada del backend basado en los archivos reales subidos

/*
 * =============================================
 * 🔒 SECURITY CONFIGURATION (SecurityConfig.java, JwtUtils.java, JwtAuthFilter.java)
 * =============================================
 */

// JwtUtils.java
// Clase utilitaria para generar y validar JWT
// Incluye métodos para extraer claims, validar expiración y obtener el username/rol del token

// JwtAuthFilter.java
// Filtro que intercepta las solicitudes HTTP para extraer y validar el JWT
// Si es válido, autentica al usuario en el contexto de Spring Security

// SecurityConfig.java
// Clase de configuración de seguridad
// Define filtros, endpoints públicos y protegidos, codificadores de contraseña y políticas CORS

/*
 * =============================================
 * 🧬 ENTIDADES (User, Animal, Donation, AnimalImage)
 * =============================================
 */

// User.java
// Representa al usuario registrado
// Campos: id, username, email, password, rol, image
// Relaciones: puede tener muchas donaciones

// Animal.java
// Representa un animal en adopción
// Campos: id, nombre, raza, sexo, descripcion, fechaNacimiento, imagenPrincipal
// Relaciones: una lista de imágenes (1:N con AnimalImage)

// Donation.java
// Representa una donación hecha por un usuario
// Campos: id, cantidad, fecha, userId

// AnimalImage.java
// Imagen adicional relacionada con un animal
// Campos: id, filename, animalId (nullable)

/*
 * =============================================
 * 📦 DTOs Y VALIDACIÓN (UserDto, AnimalDto, AuthRequest, RegisterRequest, etc.)
 * =============================================
 */

// Todos los DTOs incluyen anotaciones de validación como @NotBlank, @Email, @Size
// AnimalDto incluye una lista de AnimalImageDto
// RegisterRequest tiene campos username, email, password
// AuthRequest tiene username y password
// AuthResponse devuelve el token y datos del usuario

/*
 * =============================================
 * 🧠 SERVICIOS (UserService, AnimalService, etc.)
 * =============================================
 */

// UserServiceImpl.java
// Implementa operaciones sobre los usuarios: obtener, editar, eliminar
// Usa UserRepository, mapea con UserMapper, valida roles para seguridad

// AnimalServiceImpl.java
// Administra el CRUD de animales
// Permite paginar, filtrar por raza y sexo

// DonationServiceImpl.java
// Procesa y guarda las donaciones con Stripe

// AnimalImageServiceImpl.java
// Administra la subida y asociación de imágenes a animales

/*
 * =============================================
 * 🌐 CONTROLADORES REST (UserController, AuthController, etc.)
 * =============================================
 */

// AuthController.java
// POST /auth/login → Devuelve JWT
// Usa AuthRequest y AuthResponse

// RegisterController.java
// POST /auth/register → Crea un nuevo usuario

// UserController.java
// GET /api/usuarios/me → Info del usuario actual
// PUT /api/usuarios/{id} → Editar usuario (admin)
// DELETE /api/usuarios/{id} → Eliminar usuario (admin)

// AnimalController.java
// GET /api/animales → Listado paginado y filtrado
// POST /api/animales → Crear animal (admin)

// DonationController.java
// POST /api/donaciones → Crear donación (token de Stripe)

// AnimalImageController.java
// POST /api/animales/images/upload/{id} → Subir imagen

/*
 * =============================================
 * 📑 SWAGGER Y DOCUMENTACIÓN AUTOMÁTICA
 * =============================================
 */

// Configurado en pom.xml con springdoc-openapi-starter-webmvc-ui
// Accesible en: http://localhost:8080/swagger-ui.html
// Anotar los métodos con @Operation(summary = "...", description = "...")

/*
 * =============================================
 * ⚠️ GESTIÓN DE ERRORES
 * =============================================
 */

// GlobalExceptionHandler.java
// Usa @ControllerAdvice para capturar errores
// Maneja: MethodArgumentNotValidException, ResourceNotFoundException, etc.

// ResourceNotFoundException.java
// Excepción personalizada para recursos no encontrados

/*
 * =============================================
 * ⚙️ CONFIGURACIONES ADICIONALES
 * =============================================
 */

// application.properties usa variables de entorno: DB, JWT, Stripe
// DotenvApplicationContextInitializer.java permite leer .env
// StripeConfig y StripeProperties manejan configuración para pagos
// WebConfig.java configura CORS y recursos estáticos (por ejemplo, imágenes)


// 🎯 Proyecto documentado completamente para desarrolladores y consumidores de API
// Incluye seguridad, validación, integración con Stripe y buenas prácticas REST



© 2025 Protectora de Animales | Proyecto Fullstack Java + React
