FROM node:latest

WORKDIR /opt/AlphaBot2

COPY package*.json ./
RUN npm install --no-optional && npm cache clean --force

WORKDIR /opt/AlphaBot2/app
COPY . .

#RUN groupadd -r alphabot && useradd -r -g alphabot alphabot
#USER alphabot:alphabot
CMD [ "node", "alphabot.js" ]
