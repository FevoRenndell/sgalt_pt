# 📌 Usa una imagen oficial de Node.js como base
FROM node:20

# 📌 Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# 📌 Copia los archivos de dependencias (package.json y package-lock.json)
COPY package*.json ./

# 📌 Instala las dependencias necesarias para React + Vite
RUN npm install

# 📌 Copia el resto del código fuente del frontend al contenedor
COPY . .

# 📌 Expone el puerto en el que corre Vite por defecto
EXPOSE 5173

# 📌 Comando que ejecuta la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]