# Wi Backend

<p align="center">
  <img src="" alt="Imagen" width="300" />
</p>


This is a NestJS project with a modular structure organized to facilitate the development and maintenance of your application. Follow the steps below to get started:

## Step  1: Clone the repository
```bash
git clone https://github.com/MichaelDonado/wi-backend.git
```
## Step 2: Installs the dependencies
Make sure you have Node.js and npm (or yarn) installed on your machine. Then, run the following command to install the dependencies:

```
npm install
 o
yarn install
```

## Step 3: Have Nest CLI installed
```
npm i -g @nestjs/cli
```

## Step 4: Configuration

Inside the src/config folder, you will find configuration files for different environments (development, production, etc.). Adjust these files according to your needs.
copy the .env.example those are the environment variables to be configured, if it is for development the file should be .env.dev, for prod .env
```
MONGODB_HOST= 
APP_PORT= 
JWT_SECRET=
WI_API=
PUBLIC_KEY=
```
## 🏗️ Project Structure
The structure of the project is as follows:
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

## Step 5: Start application
To run the application in development mode, use the following command:

```
npm run start:dev
# o
yarn start:dev
```

## Used stack 

- <img src="https://cdn.worldvectorlogo.com/logos/nodejs-1.svg" alt="Imagen" width="30" heigth="30" /> NodeJs
- <img src="https://cdn.worldvectorlogo.com/logos/nestjs.svg" alt="Imagen" width="30" heigth="30" /> NestJs
- <img src="https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg" alt="Imagen" width="30" heigth="30" /> MongoDB

# Notes
Website:
 <a target="_blank" href="">View Web Site </a> 

Endpoints:
 <a target="_blank"  href="">View Documentation </a> 
```
load backend-wi.postman_collection.json file into postman 
```

