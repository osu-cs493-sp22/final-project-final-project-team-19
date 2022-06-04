FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm i
ENV PORT=8000
EXPOSE ${PORT}
CMD ["npm", "start"]
