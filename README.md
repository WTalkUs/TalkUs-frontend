# TalkUs - Frontend

TalkUs es una aplicación que permite a los usuarios crear grupos y comunicarse con otras personas de todo el mundo sobre diversos temas. Este repositorio contiene el frontend de la aplicación, desarrollado con **Next.js**, **TailwindCSS**, y **Firebase**.

## Tabla de Contenidos

- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Despliegue](#despliegue)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Características

- Autenticación de usuarios con Firebase.
- Creación y gestión de publicaciones.
- Sistema de grupos y etiquetas.
- Diseño responsivo con **TailwindCSS**.
- Soporte para temas claro y oscuro.
- Integración con HeroUI para componentes de interfaz de usuario.

## Estructura del Proyecto

```plaintext
src/
├── app/
│   ├── common/
│   │   ├── components/       # Componentes reutilizables (Navbar, Login, etc.)
│   │   ├── icons/            # Iconos utilizados en la aplicación
│   │   ├── utils/            # Utilidades y datos mock
│   ├── contexts/             # Proveedores de contexto (AuthProvider, MainProvider)
│   ├── lib/                  # Configuración de Firebase y funciones auxiliares
│   ├── services/             # Servicios para autenticación y API
│   ├── [globals.css]         # Estilos globales
│   ├── [layout.tsx]          # Layout principal de la aplicación
│   ├── [page.module.css]     # Estilos específicos de la página principal
│   ├── [page.tsx]            # Página principal
├── public/                   # Archivos estáticos (imágenes, íconos, etc.)
├── [tailwind.config.ts]      # Configuración de TailwindCSS
├── [next.config.ts]          # Configuración de Next.js
```

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu máquina:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/) como gestor de paquetes

Además, necesitarás una cuenta de Firebase y crear un proyecto para obtener las credenciales necesarias para la autenticación y la base de datos.

## Instalación

1. Clona este repositorio en tu máquina:

   ```bash
   git clone https://github.com/tu-usuario/talkus-frontend.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd talkus-frontend
   ```

3. Instala las dependencias del proyecto:

   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

4. Crea un archivo `.env.local` en la raíz del proyecto y agrega tus credenciales de Firebase:

   ```plaintext
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
   ```

5. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   ```

6. Abre tu navegador y visita [http://localhost:3000](http://localhost:3000) para ver la aplicación en acción.

## Scripts Disponibles

Este proyecto incluye los siguientes scripts de npm:

- `dev`: Inicia el servidor de desarrollo.
- `build`: Compila la aplicación para producción.
- `start`: Inicia la aplicación en modo producción.
- `lint`: Ejecuta el analizador de código estático ESLint.

## Despliegue

Para desplegar la aplicación en producción, sigue estos pasos:

1. Compila la aplicación para producción:

   ```bash
   npm run build
   # o
   yarn build
   # o
   pnpm build
   ```

2. Inicia la aplicación en modo producción:

   ```bash
   npm run start
   # o
   yarn start
   # o
   pnpm start
   ```

3. Accede a la aplicación en tu servidor remoto o servicio de alojamiento.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir a este proyecto, sigue estos pasos:

1. Fork este repositorio.
2. Crea una nueva rama para tu característica o corrección de errores:

   ```bash
   git checkout -b mi-nueva-caracteristica
   ```

3. Realiza tus cambios y haz commit de ellos:

   ```bash
   git commit -m "Agrega mi nueva característica"
   ```

4. Envía tus cambios a tu repositorio forked:

   ```bash
   git push origin mi-nueva-caracteristica
   ```

5. Crea un Pull Request en este repositorio.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para obtener más detalles.

---

¡Gracias por usar TalkUs! Si tienes alguna pregunta o sugerencia, no dudes en ponerte en contacto con nosotros.
