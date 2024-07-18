## Installation

To run app locally,

- clone the repository

```bash
git clone https://github.com/manavsiddharthgupta/img-chatbot.git
```

- go to the project directory(server)

```bash
cd server
```

- install dependencies

```bash
npm install
```

I have hardcoded the db_url in the the code, will remove later.

- run the server

```bash
npm run dev
```

check the server is running on http://localhost:3002 and the db is connected.

- go to the project directory(client)

```bash
cd ../client
```

- install dependencies

```bash
npm install
```

- add .env file with the following variables

```bash
REACT_APP_BASE_API_URL=http://localhost:3002/api

REACT_APP_STORJ_ACCESS_KEY=**I have sent the access key with mail**
REACT_APP_STORJ_SECRET_KEY=**I have sent the secret key with mail**
```

- run the app

```bash
npm run start
```

## Info

- This is a simple app where you can upload an image and the app will analyze the image and give you the response.
- The image is uploaded to aws s3 bucket and then using the url the image is analyzed.
- Tessaract OCR is used to analyze the image and store the response in mongodb.

- The app is divided into two parts, the client and the server.
- The client is a react app and the server is a express app.

## Guide

- Afer running the server and the client, you can upload an image in the client and add the text to get the response.
- Download the image from the link provided and check the response.
- ![Image 1](https://imgur.com/1.jpg)

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
