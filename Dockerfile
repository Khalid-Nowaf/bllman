FROM node:Boron 

RUN git clone https://github.com/Khalid-Nowaf/bllman.git

WORKDIR /bllman/app
RUN npm install

EXPOSE 3000

CMD node app/bin/www



