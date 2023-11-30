FROM node:17-alpine3.12
WORKDIR app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5173
CMD [ "npm", "start" ]