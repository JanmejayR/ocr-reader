import tesseract from 'node-tesseract-ocr'
import path from 'path';
import isBase64 from 'is-base64';


export const getText = (req, res) => {
      const { base64_image } = req.body;

    if (!isBase64(base64_image, { allowMime: true })  || !isValidImage(base64_image)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid base64_image.' },
      });
    }
    const base64Data = base64_image.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

      const config = {
        lang: "eng",
        oem: 1,
        psm: 3,
    };
    tesseract.recognize(imageBuffer, config)
        .then(text => {
            res.status(200).json({ success: true, result: { text } });
        })
        .catch((error) => {
          console.log(" error :- ", error);
            res.status(500).json({ success: false, error: { message: 'Tesseract processing failed.' } });
        });
  }

  const isValidImage = (base64) => {
    const mimeType = base64.split(';')[0].split(':')[1];
    return mimeType && mimeType.startsWith('image/');
};