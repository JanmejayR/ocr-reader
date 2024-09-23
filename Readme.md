# Tesseract OCR Server

## Installation
To run this application, you will need Docker. If you don't have docker, you can also install [tesseract](https://tesseract-ocr.github.io/tessdoc/Installation.html) mannually  , and set binary property of config object in both controller files to path of tesseract.exe in your local system.

## Docker Image
This project is Dockerized, and you can easily run it using the Docker image hosted on Docker Hub. 

### Pull the Docker Image
To run the application without cloning the repository, you can pull the Docker image directly and run tests:
```bash
docker pull janmejayr/ocr-reader:latest
```
Use this command to run tests
```bash
docker run -it --rm janmejayr/ocr-reader:latest npm run test
```

### Alternatively, you can run the container and make api calls from postman
To do so, first get the server running by using this command
```bash
docker run -p 3000:3000 janmejayr/ocr-reader:latest
```
### Make API calls from postman
Once server is running, to call the apis from Postman, Import the **ocr-reader.postman_collection.json** file into postman and execute them from postman. I have included a sample base64 image url there. you may change the bbox_type from request body in get-bboxes request to test for "word" , "line", "paragraph", "block", "page"



# To run the project locally 

1. Clone the repository:
```bash
git clone https://github.com/JanmejayR/ocr-reader.git
cd ocr-reader
```

2. Build and run the Docker container:

```bash
docker build -t ocr-reader .
docker run -p 3000:3000 ocr-reader
```

3. Make API calls from postman
To call the apis from Postman, Import the **ocr-reader.postman_collection.json** file into postman and execute them from postman. I have included a sample base64 image url there.

5. Testing
Automated tests have been implemented to cover all important checks. To run automated tests, after running docker container, use this command :
```bash
npm run test
```


This project is a Node.js server that utilizes Tesseract OCR (Version 5) to provide two APIs:
- **get-text**: Extracts the entire text from a given image.
- **get-bboxes**: Extracts the bounding boxes from an image for a specified type (e.g., "word", "line", "paragraph", "block", or "page").

## API Endpoints

### 1. `POST /api/get-text`
- **Request Body**:
  ```json
  {
    "base64_image": "data:image/png;base64,..."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "result": {
      "text": "Extracted text from the image."
    }
  }
  ```
- **Error Responses**:
  - 400: Invalid base64 image.
  - 500: Tesseract processing failed.

### 2. `POST /api/get-bboxes`
- **Request Body**:
  ```json
  {
    "base64_image": "data:image/png;base64,...",
    "type": "word" // or "line", "paragraph", "block", "page"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "result": {
      "bboxes": [
        { "text": "word", "bbox": [x1, y1, x2, y2] }
      ]
    }
  }
  ```
- **Error Responses**:
  - 400: Invalid base64 image or invalid bounding box type.
  - 500: Tesseract processing failed.


