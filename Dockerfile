FROM node:21.5.0 as app

WORKDIR /app

COPY . ./
RUN npm i



FROM app as development

WORKDIR /app

CMD [ "npm", "run", "dev" ]


FROM app as production

WORKDIR /app

RUN npm run build
ENTRYPOINT [ "cp", "-r", "/app/dist/.", "/dist" ]