# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de tu aplicación al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Instala PM2 globalmente
RUN npm install -g pm2

# Copia el resto de los archivos de tu aplicación
COPY . .

# Expone el puerto en el que tu aplicación se ejecutará
EXPOSE 3000

# Define el comando para ejecutar tu aplicación usando PM2 cuando se inicie el contenedor
CMD ["pm2-runtime", "start", "app.js"]
