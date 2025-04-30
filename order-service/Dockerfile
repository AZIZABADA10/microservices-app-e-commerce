FROM node:18

# Crée le dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie tout le reste du projet
COPY . .


CMD ["node", "src/index.js"]
