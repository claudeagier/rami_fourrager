# Stage de développement
FROM node:14 AS development

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copier les fichiers du projet dans le répertoire de travail du conteneur
COPY ./ui .

# Installer les dépendances, y compris les dépendances de développement
RUN npm install

# Exposer le port 8080 pour l'accès à l'application en développement
EXPOSE 8080

# Commande pour démarrer l'application en mode développement
CMD ["npm", "run", "serve"]

# Stage de production
FROM node:14 AS production

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copier les fichiers du projet dans le répertoire de travail du conteneur
COPY ./ui .

# Installer les dépendances sans les dépendances de développement
RUN npm install --only=production

# Construire l'application
RUN npm run build

# Exposer le port 8080 pour l'accès à l'application en production
EXPOSE 8080

# Commande pour démarrer l'application en mode production
CMD ["npm", "run", "serve"]
