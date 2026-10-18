# Veterinaria San Marcos

Sitio web de la Veterinaria San Marcos, clínica veterinaria de Rancagua. Permite conocer la clínica, revisar un catálogo de medicamentos y productos, agendar citas en línea, comprar con un carrito y administrar el inventario, los usuarios y las citas.

Proyecto de la asignatura DSY1104, Duoc UC, Escuela de Informática y Telecomunicaciones. Evaluación Parcial 2.

## Integrantes

- Macarena Rau
- Gonzalo Salas

## Estructura del repositorio

```
fase 1/Vet-HTML      Primera etapa: sitio estático en HTML, CSS y JavaScript
fase 2/Vet-React     Segunda etapa: aplicación en React (versión actual)
fase 2/docs          Documentos: ERS 2.0 y documento de cobertura del testing
```

## Tecnologías

- React 19 y Vite 8
- React Router (rutas) y React Bootstrap (componentes y estilos)
- Context API y hooks personalizados para el estado
- Leaflet (mapa de ubicación)
- localStorage (persistencia simulada, sin backend)
- Vitest, Testing Library y jsdom (pruebas), con cobertura v8

## Funcionalidades

- Inicio con servicios, equipo, noticias expandibles y formulario de contacto.
- Catálogo con búsqueda por nombre, filtro por categoría y detalle de cada producto.
- Ofertas con 20 % de descuento, mostrando precio original y precio final.
- Carrito persistente: agregar, cambiar cantidades, quitar, vaciar y ver el total.
- Agendamiento de citas (solo clientes con sesión iniciada). La consulta cuesta $15.000 y se agrega al carrito.
- Checkout con despacho a domicilio o retiro en tienda, validación de datos, pago simulado, número de orden y boleta imprimible.
- Inicio de sesión y registro con validaciones (RUN, correo, mayoría de edad, contraseña).
- Panel de administración con gestión de productos, usuarios y citas, según el rol.

## Roles y cuentas de prueba

Roles: Cliente, Funcionario y Administrador.

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@gmail.com | admin123 |
| Funcionario | func@gmail.com | func123 |

Los clientes se crean desde la opción de registro.

## Cómo ejecutar

Requisitos: Node.js 22 o superior y npm.

Desde la carpeta `fase 2/Vet-React`:

```
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera la versión de producción en `dist` |
| `npm run preview` | Muestra la versión de producción generada |
| `npm run lint` | Revisa el código con oxlint |
| `npm run test` | Pruebas en modo observación |
| `npm run test:run` | Ejecuta las pruebas una vez |
| `npm run coverage` | Ejecuta las pruebas y genera el informe de cobertura |

## Pruebas y cobertura

Las pruebas unitarias usan Vitest con Testing Library y están junto al código que prueban (archivos `.test.jsx` y `.test.js`). Cubren las validaciones, los hooks, el encabezado, el pie de página, el inicio, el catálogo, el detalle de producto, el carrito y el checkout.

- 110 pruebas en 10 archivos.
- Cobertura aproximada: 99,5 % en sentencias, 94 % en ramas, 100 % en funciones y 99,4 % en líneas.

El informe completo se genera con `npm run coverage` y se abre en `coverage/index.html`. El análisis está en el documento de cobertura de `fase 2/docs`.

## Estructura de `fase 2/Vet-React/src`

```
components/   Header, Footer, Mapa y TarjetaProducto
context/      AuthContext (sesión y usuarios) y CarritoContext
hooks/        useCarrito, useFormulario, useNoticias y useAdmin
pages/        Index, Login, Catalogo, Producto, Carrito, Checkout, Ofertas, Cita y Admin
utils/        productos.js (datos del catálogo) y validaciones.js
```

## Rutas

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

## Documentación

En `fase 2/docs`:

- ERS 2.0 - Vet San Marcos: especificación de requisitos de software (IEEE 830).
- Cobertura del testing: propuesta de pruebas y análisis de cobertura.

## Despliegue

La aplicación se ejecuta en una instancia EC2 de AWS, en modo desarrollo, en el puerto 5173 de su IP pública:

```
http://54.237.102.88:5173
```

La IP pública puede cambiar si la instancia se reinicia.

## Limitaciones

- No hay backend ni base de datos: usuarios, sesión y carrito se guardan en `localStorage` del navegador, y las contraseñas no están cifradas. Es una demostración académica y no debe usarse con datos reales.
- El pago es simulado (aprobado el 80 % de las veces) y no emite documentos tributarios.
- La pestaña de mensajes del administrador es informativa: la recepción de mensajes del formulario de contacto queda para una etapa posterior.
- El backend, la base de datos, la autenticación real y las fichas clínicas se incorporarán en etapas siguientes.