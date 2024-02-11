# Wi Backend

<p align="center">
  <img src="" alt="Imagen" width="300" />
</p>


Este es un proyecto de NestJS con una estructura modular organizada para facilitar el desarrollo y mantenimiento de tu aplicación. Sigue los siguientes pasos para comenzar:

## Paso 1: Clona el Repositorio

```bash
git clone https://github.com/MichaelDonado/wi-backend.git
```
## Paso 2: Instala las Dependencias
Asegúrate de tener Node.js y npm (o yarn) instalados en tu máquina. Luego, ejecuta el siguiente comando para instalar las dependencias:

```
npm install
 o
yarn install
```

## Paso 3: Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

## Paso 4: Configuración

Dentro de la carpeta src/config, encontrarás archivos de configuración para diferentes entornos (desarrollo, producción, etc.). Ajusta estos archivos según tus necesidades.
copia el .env.example esas son las variables de entornos a configurar , si es para desarrollo el archivo debe ser .env.dev, para prod .env
```
MONGODB_HOST= 
APP_PORT= 
JWT_SECRET=
WI_API=
PUBLIC_KEY=
```
## 🏗️ Estructura del Proyecto
La estructura del proyecto es la siguiente:
```
src/
│
├── config/
│   ├── env.config.ts
│   ├── enviroments.ts
│   └── ...
│
├── core/
│   ├── ...
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── ...
│   │
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── ...
│   │
│   ├── trips/
│   │   ├── trips.controller.ts
│   │   ├── trips.service.ts
│   │   ├── trips.module.ts
│   │   └── ...
│   │
│   └── ...
│
├── main.ts
└── ...


```

## Paso 5: Inicia la Aplicación
Para ejecutar la aplicación en modo de desarrollo, utiliza el siguiente comando:

```
npm run start:dev
# o
yarn start:dev
```

## Stack usado

- <img src="https://cdn.worldvectorlogo.com/logos/nodejs-1.svg" alt="Imagen" width="30" heigth="30" /> NodeJs
- <img src="https://cdn.worldvectorlogo.com/logos/nestjs.svg" alt="Imagen" width="30" heigth="30" /> NestJs
- <img src="https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg" alt="Imagen" width="30" heigth="30" /> MongoDB

# Notas
Sito:
 <a target="_blank" href="">Mirar Sito Web </a> 

Endpoints:
 <a target="_blank"  href="">Mirar  Documentacion </a> 
```
cargar el archivo backend-wi.postman_collection.json en postman 
```

