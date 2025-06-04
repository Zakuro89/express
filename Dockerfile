
# utiliser image officielle node comme image de base
FROM node:alpine

# définir le repertoire de travail
WORKDIR /usr/src/app

#copie du package json et du lock dans le repertoire de travail
COPY package*.json ./

# installer les dépendances de l'application
RUN npm install

# copie du reste des fichiers de l'appli
COPY . .

# on expose le port 8080
EXPOSE 8080

# lancer serveur node.js
CMD ["npm", "run", "dev"]
