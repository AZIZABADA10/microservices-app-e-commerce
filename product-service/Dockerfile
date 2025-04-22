
FROM node:18-alpine

WORKDIR /app

# Étape 1: Copier les fichiers de dépendances
COPY package*.json ./

# Étape 2: Installer les dépendances
RUN npm install --production

# Étape 3: Copier le reste du code
COPY . .

CMD ["npm", "start"]