FROM node:14

# Installing Tesseract OCR in the container
RUN apt-get update && \
    apt-get install -y tesseract-ocr && \
    apt-get clean

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# The port we are using to run the app
EXPOSE 3000

# The command to run the app
CMD ["node", "server.js"]
