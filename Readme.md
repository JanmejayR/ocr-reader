# Tesseract OCR Server

## Installation
To run this application, you will need Docker. If you don't have docker, you can also install [tesseract](https://tesseract-ocr.github.io/tessdoc/Installation.html) mannually  , and set binary property of config object in both controller files to path of tesseract.exe in your local system.

### Steps to Run Locally

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


## Testing
Automated tests have been implemented to cover all important checks. To run automated tests, after running docker container, use this command :
```bash
npm run test
```
