import request from 'supertest'
import app from './app.js' // Adjust the path to your app
import testImageUrl from './testImageUrl.js';

// This is just a valid base64 encoded pdf used to show that the app throws error when the base64 image is not an image but another valid base64 url
import testPdf from './testPdf.js';

describe('OCR API Tests', () => {
  describe('/api/get-text', () => {
    test('should return text for a valid base64 image', async () => {
      const response = await request(app)
        .post('/api/get-text')
        .set('Content-Type', 'application/json')
        .send({ base64_image: testImageUrl });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body.success).toBe(true);
      expect(response.body.result.text).toBeDefined(); 
    });

    test('should return an error for an invalid base64 image', async () => {
      const response = await request(app)
        .post('/api/get-text')
        .set('Content-Type', 'application/json')
        .send({ base64_image: 'just an invalid url' });

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid base64_image.');
    });

    test('should return an error for a non-image file encoded in base64', async () => {
      const response = await request(app)
        .post('/api/get-text')
        .set('Content-Type', 'application/json')
        .send({ base64_image: testPdf });

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid base64_image.');
    });
  });

  describe('/api/get-bboxes', () => {
    test('should return bounding boxes for a valid base64 image and word bbox type', async () => {
      const response = await request(app)
        .post('/api/get-bboxes')
        .set('Content-Type', 'application/json')
        .send({
          base64_image: testImageUrl,
          bbox_type: 'word',
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body.success).toBe(true);
      expect(response.body.result.bboxes).toBeDefined(); // Check for actual bboxes if needed
    });

    test('should return an error for an invalid base64 image', async () => {
      const response = await request(app)
        .post('/api/get-bboxes')
        .set('Content-Type', 'application/json')
        .send({
          base64_image: 'An invalid base64 encoded image.',
          bbox_type: 'word',
        });

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid base64_image.');
    });

    test('should return an error for a non-image file encoded in base64', async () => {
      const response = await request(app)
        .post('/api/get-bboxes')
        .set('Content-Type', 'application/json')
        .send({
          base64_image: testPdf,
          bbox_type: 'word',
        });

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid base64_image.');
    });

    test('should return an error for an invalid bbox type', async () => {
      const response = await request(app)
        .post('/api/get-bboxes')
        .set('Content-Type', 'application/json')
        .send({
          base64_image: testImageUrl,
          bbox_type: 'foo',
        });

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid bbox_type.');
    });
  });
});
