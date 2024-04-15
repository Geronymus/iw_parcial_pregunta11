# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de tu aplicación al contenedor
COPY package*.json ./
COPY controllers ./controllers
COPY data ./data
COPY routes ./routes
COPY views ./views
COPY app.js ./

# Instala las dependencias
RUN npm install

# Expone el puerto en el que tu aplicación se ejecutará
EXPOSE 3000

# Define el comando para ejecutar tu aplicación cuando se inicie el contenedor
CMD ["npm", "start"]
