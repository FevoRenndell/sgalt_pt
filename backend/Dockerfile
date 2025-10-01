# 📌 Usa una imagen oficial de Node.js como base
FROM node:20

# 📌 Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# 📌 Copia los archivos del package.json y package-lock.json
# Esto permite instalar dependencias antes de copiar el resto del código
COPY package*.json ./

# 📌 Instala las dependencias del backend (npm install)
RUN npm install

# 📌 Copia el resto del código fuente del backend al contenedor
COPY . .

# 📌 Expone el puerto que utiliza el backend (asegúrate de que coincida con tu app)
EXPOSE 3000

# 📌 Comando que se ejecutará al iniciar el contenedor
CMD ["npm", "run", "dev"]
