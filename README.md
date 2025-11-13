**  Conar el repositorio  **
    git clone https://github.com/Daelnaco/Back_mensajeria.git


// Para iniciar el sistema completo es necesario tener 3 consolas de Poweshell abiertas //

**  Consola 1  **  Iniciar las BD  **  Deben estar iniciado antes de correr el back ** 
    **  MySQL  **
    **  Mongo  ** 
        Start-Service MongoDB
        o
        mongod


**  Consola 2  **  Iniciar el Back  **
**  Accede a la ruta del proyecto  **
    cd "c:\ruta_del_proyecto\Back_mensajeria"
  
**  Instalar dependencias **
    pnpm install

** Iniciar el  Back  **  Puerto 9000  **
  **  Desarrollo  **
      npm run start:dev
    
  **  Producción  **
    pnpm build
    pnpm start:prod


**  Consola 3  **  Iniciar el Front  **

**  Accede a la ruta del proyecto  **
    cd "c:\ruta_del_proyecto\Front_mensajeria"

**  Instalar dependencias **
    npm install

** Iniciar el  Front  **  Puerto 9001  **
    npm run dev

*** Swagger ***
    En la URL http://localhost:9000/api/docs