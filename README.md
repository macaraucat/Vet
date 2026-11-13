# Veterinaria San Marcos

Sitio web de la Veterinaria San Marcos, clínica veterinaria de Rancagua. Permite conocer la clínica, revisar un catálogo de medicamentos y productos, comprar con un carrito y administrar el inventario, los usuarios y las órdenes.

Proyecto de la asignatura DSY1104 (Desarrollo Fullstack II), Duoc UC, Escuela de Informática y Telecomunicaciones. Evaluación Parcial 3: integración del backend con el frontend.

## Integrantes

- Macarena Rau
- Gonzalo Salas

## Estructura del repositorio

```
fase1/Vet-HTML       Primera etapa: sitio estático en HTML, CSS y JavaScript
fase2/Vet-React      Segunda etapa: aplicación en React con datos simulados
fase2/docs           Documentos de la fase 2: ERS 2.0 y cobertura del testing
fase3/Vet-React      Tercera etapa: frontend en React conectado al backend (versión actual)
fase3/Vet-Spring     Tercera etapa: backend en Spring Boot con microservicios (versión actual)
```

## Arquitectura (fase 3)

```
Frontend React (5173)
        │  HTTP + JWT
        ▼
API Gateway (8080) ── Swagger unificado
   ├── auth-service     (8081)  Login, registro y renovación de tokens
   ├── user-service     (8082)  Gestión de usuarios      → MySQL vet_usuarios
   └── product-service  (8083)  Productos, categorías y boletas → MySQL vet_productos

common: librería compartida (JWT, seguridad, excepciones y configuración de OpenAPI)
```

El frontend se comunica solo con el API Gateway. El `auth-service` consulta al `user-service` mediante OpenFeign, protegido con una clave interna (`INTERNAL_API_KEY`).

## Tecnologías

**Frontend**
- React 19 y Vite
- React Router y React Bootstrap
- Context API y hooks personalizados
- Leaflet (mapa de ubicación)
- Vitest y Testing Library (pruebas)

**Backend**
- Java 25 y Spring Boot 4
- Spring Security con JWT (token de acceso y token de renovación)
- Spring Data JPA y MySQL
- Spring Cloud Gateway y OpenFeign
- springdoc OpenAPI (Swagger)
- Maven

## Funcionalidades

- Inicio con servicios, equipo, noticias expandibles y formulario de contacto.
- Catálogo con búsqueda por nombre, filtro por categoría y detalle de cada producto, consumido desde el backend.
- Ofertas con 20 % de descuento, mostrando precio original y precio final.
- Carrito persistente: agregar, cambiar cantidades, quitar, vaciar y ver el total.
- Checkout con despacho a domicilio o retiro en tienda, validación de datos y generación de boleta en el backend.
- Inicio de sesión y registro con validaciones (RUN, correo, mayoría de edad, contraseña).
- Sesión que se mantiene al recargar la página, con renovación automática del token.
- Panel de administración con gestión de productos, usuarios y órdenes, según el rol.

## Roles y permisos

| Rol | Permisos |
|---|---|
| Administrador | Acceso total: dashboard, usuarios, productos, órdenes y perfil |
| Funcionario | Panel con productos (solo lectura) y perfil |
| Cliente | Solo la tienda: catálogo, carrito y checkout |

Los permisos se validan en el backend (`@PreAuthorize`) y también se restringen en las vistas del frontend.

## Cuentas de prueba

Se crean automáticamente al iniciar el `user-service` por primera vez.

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@gmail.com | admin123 |
| Funcionario | func@gmail.com | func123 |

Los clientes se crean desde la opción de registro.

## Cómo ejecutar

### Requisitos

- Java 25 y Maven (o el `mvnw` incluido en cada servicio)
- MySQL 8 o superior en ejecución
- Node.js 22 o superior y npm

### 1. Backend

Desde `fase3/Vet-Spring`, copiar `.env.example` como `.env` y completar los valores:

| Variable | Descripción |
|---|---|
| `JWT_SECRET` | Clave HMAC en Base64, mínimo 32 bytes. Se genera con `openssl rand -base64 32` |
| `INTERNAL_API_KEY` | Cadena aleatoria, igual para `auth-service` y `user-service`. Se genera con `openssl rand -hex 32` |
| `DB_URL` | URL base de MySQL, sin nombre de base. Ejemplo: `jdbc:mysql://localhost:3306` |
| `DB_USERNAME` | Usuario de MySQL |
| `DB_PASSWORD` | Contraseña de MySQL |
| `CORS_ORIGINS` | Origen del frontend. Ejemplo: `http://localhost:5173` |

Las bases `vet_usuarios` y `vet_productos` se crean solas. Compilar e iniciar cada servicio en una terminal distinta:

```
mvn clean install

cd user-service    && mvn spring-boot:run
cd auth-service    && mvn spring-boot:run
cd product-service && mvn spring-boot:run
cd api-gateway     && mvn spring-boot:run
```

### 2. Frontend

Desde `fase3/Vet-React`, copiar `.env.example` como `.env` (`VITE_API_URL=http://localhost:8080`) y ejecutar:

```
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Documentación de la API (Swagger)

Con el backend en ejecución, la documentación unificada está en:

```
http://localhost:8080/swagger-ui/index.html
```

Cada servicio también expone su propio Swagger en `/swagger-ui.html` (puertos 8081, 8082 y 8083). Para probar endpoints protegidos, usar el botón **Authorize** con el token obtenido en el login.

## Endpoints principales

Todas las rutas están versionadas con el prefijo `/api/v1`.

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/auth/login` | Inicio de sesión | Público |
| POST | `/auth/registro` | Registro de cliente | Público |
| POST | `/auth/refresh` | Renovación de tokens | Público |
| GET | `/users/me` | Datos del usuario autenticado | Autenticado |
| GET, POST | `/users` | Listar y crear usuarios | Administrador |
| GET, PUT, DELETE | `/users/{id}` | Consultar, actualizar y eliminar usuario | Administrador |
| GET | `/productos`, `/productos/{id}` | Catálogo y detalle | Público |
| POST, PUT, DELETE | `/productos`, `/productos/{id}` | Gestión de productos | Administrador |
| GET | `/categorias`, `/categorias/{id}` | Consulta de categorías | Público |
| POST, PUT, DELETE | `/categorias`, `/categorias/{id}` | Gestión de categorías | Administrador |
| POST | `/boletas` | Crear boleta de compra | Autenticado |
| GET | `/boletas`, `/boletas/{id}`, `/boletas/{id}/detalle` | Consulta de órdenes | Administrador |

## Modelo de datos

Usuario → Boleta → Detalle de boleta → Producto → Categoría.

- `vet_usuarios`: tabla `usuario`.
- `vet_productos`: tablas `boleta`, `detalle_boleta`, `producto` y `categoria`.

## Frontend: scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera la versión de producción en `dist` |
| `npm run preview` | Muestra la versión de producción generada |
| `npm run lint` | Revisa el código con oxlint |
| `npm run test` | Pruebas en modo observación |
| `npm run test:run` | Ejecuta las pruebas una vez |
| `npm run coverage` | Ejecuta las pruebas y genera el informe de cobertura |

## Estructura de `fase3/Vet-React/src`

```
components/   Header y Footer
context/      AuthContext (sesión y tokens) y CarritoContext
hooks/        useCarrito, useFormulario y useAdmin
pages/        Index, Login, Catalogo, Carrito, Checkout, Ofertas y Admin
services/     api.js (fetch base), authApi.js y tiendaApi.js
utils/        validaciones.js
```

## Rutas del frontend

| Ruta | Página |
|---|---|
| `/` | Inicio |
| `/login` | Inicio de sesión y registro |
| `/catalogo` | Catálogo (admite `?categoria=`) |
| `/producto/:id` | Detalle de producto |
| `/ofertas` | Ofertas |
| `/carrito` | Carrito de compras |
| `/checkout` | Pago |
| `/admin` | Administración (Funcionario y Administrador) |

## Seguridad y sesión

- El backend emite un token de acceso (1 hora) y un token de renovación (3 días). El filtro JWT rechaza un token de renovación usado como token de acceso.
- Las contraseñas se almacenan cifradas.
- El frontend guarda los tokens en `localStorage`, decodifica el rol desde el token, restaura la sesión al recargar y renueva el token 30 segundos antes de que expire.
- Las vistas del panel de administración se restringen según el rol y el backend vuelve a validar cada acción.

## Documentación

En `fase2/docs`:

- ERS 2.0 - Vet San Marcos: especificación de requisitos de software (IEEE 830).
- Cobertura del testing: propuesta de pruebas y análisis de cobertura.

## Limitaciones

- El pago es simulado y no emite documentos tributarios.
- Las citas en línea y las fichas clínicas quedan para una etapa posterior.
- Es una demostración académica y no debe usarse con datos reales.