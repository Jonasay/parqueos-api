API Gestión de Parqueos 

Universidad Mesoamericana Quetzaltenango (UMES)

Facultad de Ingeniería - Técnico en Desarrollo de Software

Curso: Arquitectura de Sistemas - Proyecto Final

-Descripción General

Esta API RESTful proporciona el backend robusto para un sistema integral de gestión de parqueos. El proyecto cumple con el requerimiento de una estructura relacional con 16 tablas.
El sistema gestiona desde la configuración física de sucursales, niveles, espacios y catálogos de cobro como tarifas, métodos de pago, hasta la operación transaccional de clientes, vehículos, pensiones, tickets, pagos y facturación, incluyendo un sistema de auditoría (logs) y roles de usuario.

- Arquitectura del Sistema

El proyecto está construido utilizando NestJS y aplica los principios Arquitectura Limpi) y separación de capas:

Capa de Presentación (Controladores): Manejo de rutas, validación inicial con DTOs y documentación automatizada con Swagger. Ningún endpoint está expuesto sin protección.

Capa de Lógica de Negocio (Servicios): Reglas operativas, validaciones de unicidad y manejo estricto de códigos HTTP semánticos (400, 401, 403, 404, 422, 500).

Capa de Acceso a Datos (Repositorios y ORM): Implementación del Patrón Repositorio utilizando interfaces abstractas. Se utiliza Prisma ORM para interactuar con PostgreSQL, garantizando cero consultas SQL en crudo.

Integración SOA (Proxy de Autenticación): El módulo de autenticación funciona como un API Gateway ligero que se comunica de forma segura con un microservicio externo para la validación de credenciales y emisión de JWT.

- Tecnologías Utilizadas

Framework: NestJS (Node.js)

Lenguaje: TypeScript

Base de Datos: PostgreSQL

ORM: Prisma

Autenticación: JWT (JSON Web Tokens)

Documentación: Swagger (OpenAPI)

Testing: Jest (con inyección de Mocks)

- Instrucciones para Levantar el Proyecto

Sigue estos pasos para ejecutar la API en tu entorno local:

1. Prerrequisitos

Node.js (v18 o superior)

PostgreSQL (Instalado y en ejecución)

Git

2. Clonar el repositorio y configurar dependencias

git clone <tu-url-del-repositorio>
cd <nombre-de-la-carpeta>
npm install


3. Configurar Variables de Entorno

Crea un archivo .env en la raíz del proyecto basándote en el archivo de ejemplo:

# Conexión a la base de datos PostgreSQL local o en la nube
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/db_parqueos?schema=public"

# Integración con la API externa de autenticación
EXTERNAL_API_URL="https://apilogin-qh0o.onrender.com"
EXTERNAL_API_KEY="<configurada en el servicio de autenticación>"
JWT_SECRET="<secreto compartido con la firma JWT del servicio de autenticación>"


Configura estas variables en el entorno del servidor; no las envíes desde el frontend ni las
incluyas en el repositorio. `DATABASE_URL`, `EXTERNAL_API_URL`, `EXTERNAL_API_KEY` y `JWT_SECRET`
son obligatorias. La aplicación no usa un secreto predeterminado y exige que `JWT_SECRET` tenga
al menos 32 caracteres en producción. Debe coincidir con el secreto de firma del JWT externo:
parqueos valida su firma HS256, expiración e identidad antes de sincronizar al usuario, y
`JwtStrategy` verifica el mismo token con `JWT_SECRET`.

El proceso del servidor es el único que llama a la API externa, usando `EXTERNAL_API_KEY` como
cabecera `x-api-key`. El rol debe existir y estar activo en `roles`; no se aceptan privilegios desde
el registro del cliente. El perfil operativo de empleado se administra localmente y debe estar
activo para emitir tickets.

### Contrato de autenticación

- `POST /api/auth/login` recibe `{ "email": "...", "password": "..." }`. Tras validar con el
  servicio externo, verifica el JWT devuelto (HS256, vigente y con `id` igual al ID externo),
  sincroniza el usuario y devuelve
  `{ "ok": true, "usuario": { "id": <ID local>, "external_id": "<ID externo>", "email": "...",
  "rol_id": <ID rol local> }, "token": "<JWT externo>" }`. El `id` del JWT es el ID externo,
  que es el identificador que busca `JwtStrategy`; `usuario.id` siempre es el ID local.
- `POST /api/auth/registro` recibe `{ "email": "...", "password": "...", "nombres": "...",
  "apellidos": "..." }` (los nombres son opcionales). El proxy sólo reenvía esos datos permitidos.
  La API externa debe confirmar el registro y devolver `usuario` con `id`, `correo` y `rol`.
  Parqueos valida esos campos y devuelve el mismo objeto `usuario` local que el login, sin token.
- Errores: `400` entrada inválida, `401` credenciales incorrectas, `403` usuario local inactivo,
  `409` correo/identidad en conflicto, `422` registro rechazado o regla de negocio incumplida y
  `502` respuesta o comunicación inválida con el servicio externo. El rol o el ID externo faltante
  en una respuesta externa se trata como respuesta inválida, no como una identidad nueva.

### Contrato de tickets y pagos

- `POST /api/tickets/entrada` acepta `{ "placa": "P-123ABC", "espacio_id": 5 }` (también admite
  los IDs camelCase compatibles). El vehículo debe existir y estar activo; si no existe, se debe
  registrar primero mediante `POST /api/vehiculos`. El usuario autenticado debe tener empleado
  activo y el espacio debe existir, estar activo y tener estado `DISPONIBLE` o `LIBRE`. La
  reserva del espacio y la creación del ticket son transaccionales.
- `GET /api/tickets` devuelve una lista de objetos con `id`, `codigo`, `placa`, `espacio_id`,
  `hora_entrada`, `hora_salida` y `estado`. La respuesta de entrada y salida usa la misma forma.
- `PUT /api/tickets/salida/:codigo` cierra el ticket activo y libera el espacio en una transacción.
  Un ticket cerrado no se puede cerrar de nuevo.
- `POST /api/pagos` recibe `ticket_id`, `total_pagado` y `metodo_pago_id`, con los campos
  opcionales definidos en Swagger. Sólo admite tickets con salida registrada. La creación del
  pago y el cambio a `PAGADO` son transaccionales; un ticket pagado no se puede cobrar de nuevo.

No se requiere migración ni cambio de esquema Prisma para estas correcciones. Para sincronizar el
esquema existente, despliega la aplicación según el procedimiento de base de datos configurado en
tu entorno.

4. Sincronizar la Base de Datos

Sincroniza el esquema de Prisma con tu base de datos para generar las 16 tablas automáticamente:

npx prisma db push
npx prisma generate


5. Ejecutar la Aplicación

npm run start:dev


La API estará corriendo en: http://localhost:3000

## Despliegue en Render

Configura el servicio como **Web Service** con:

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`
- Variable de entorno `DATABASE_URL` apuntando a la base PostgreSQL de Render.

En producción, `start:prod` ejecuta `prisma db push` antes de iniciar NestJS para sincronizar la base con `prisma/schema.prisma`. Esto agrega las columnas faltantes `activo`/`estado_activo` con su valor predeterminado, conservando los registros existentes. Si Render tiene configurado otro comando de inicio, cámbialo a `npm run start:prod`.

- Instrucciones para Probar los Endpoints Individualmente

La API está completamente documentada con Swagger. Para interactuar con ella y probar los endpoints:

Levanta el proyecto (npm run start:dev).

Abre tu navegador e ingresa a: http://localhost:3000/api/docs 

Obtener un Token:

Ve a la sección Autenticación (Proxy SOA).

Usa el endpoint POST /api/auth/login con credenciales válidas.

Copia el token JWT devuelto en la respuesta.

Autorizar Swagger:

Haz clic en el botón verde "Authorize" en la parte superior derecha de la interfaz de Swagger.

Pega el token JWT y haz clic en "Authorize".

Probar Módulos:

Ahora puedes probar cualquier endpoint protegido (ej. Crear una Sucursal, Registrar un Vehículo, Emitir un Ticket).

La interfaz de Swagger indica claramente el formato del JSON (DTO) requerido para cada petición.

- Pruebas Unitarias con Mocks

El proyecto incluye una suite de pruebas unitarias robusta, evaluando aisladamente la capa de servicios inyectando mocks del repositorio (aislando completamente la base de datos). Existen 5 pruebas unitarias por cada módulo, garantizando el correcto manejo de excepciones.

Para ejecutar la suite de pruebas:

npm run test


Para ver la cobertura de las pruebas:

npm run test:cov
