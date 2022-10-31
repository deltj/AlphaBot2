# Use latest node.js LTS
FROM node:16

# Create app directory
WORKDIR /usr/src/AlphaBot2

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Create alphabot user/group
RUN groupadd -r alphabot && useradd -r -g alphabot alphabot

# Define the command to run the app
#USER alphabot:alphabot
CMD [ "node", "alphabot.js" ]