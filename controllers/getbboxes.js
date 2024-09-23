import tesseract from 'node-tesseract-ocr';
import isBase64 from 'is-base64';

export const getbboxes = (req, res) => {
  const { base64_image, bbox_type } = req.body;

  // Valid bounding box types
  const validBboxTypes = ["word", "line", "paragraph", "block", "page"];

  // Checking if the base64_image is provided and is a valid base64 string and is an image only, not any other file type
  if (!isBase64(base64_image, { allowMime: true }) || !isValidImage(base64_image)) {
    return res.status(400).json({
      success: false,
      error: { message: 'Invalid base64_image.' },
    });
  }

  // Check if bbox_type is valid
  if (!bbox_type || !validBboxTypes.includes(bbox_type)) {
    return res.status(400).json({
      success: false,
      error: { message: 'Invalid bbox_type.' },
    });
  }

    const config = {
      lang: 'eng',
      oem: 1,
      psm: 3,
      tessedit_create_hocr: 1 
    };

    const base64Data = base64_image.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    tesseract
    .recognize(imageBuffer, config)
    .then((result) => {
      // Ensure that the 'hocr' data exists
      if (!result || !result.includes('bbox')) {
        return res.status(500).json({
          success: false,
          error: { message: 'Failed to extract bounding boxes.' },
        });
      }
      const bboxes = extractBoundingBoxes(result, bbox_type); 
      res.json({
        success: true,
        result: { bboxes },
      });
    })
    .catch((error) => {
      console.log('Error:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Tesseract processing failed.' },
      });
    });

};


// Just a custom function to extract bbox data from the HOCR result
const extractBoundingBoxes = (result, bbox_type) => {
  const bboxes = [];
  let bboxKeyword;

  // Determine the bbox keyword based on the bbox_type
  switch (bbox_type) {
    case "word":
      bboxKeyword = "ocrx_word";
      break;
    case "line":
      bboxKeyword = "ocr_line";
      break;
    case "paragraph":
      bboxKeyword = "ocr_par";
      break;
    case "block":
      bboxKeyword = "ocr_carea";
      break;
    case "page":
      bboxKeyword = "ocr_page";
      break;
    default:
      return bboxes; 
  }

  // Here, I  splitted the result by lines to look for bbox information per line
  const lines = result.split('\n');

  lines.forEach(line => {
    if (line.includes(bboxKeyword) && line.includes('bbox')) {

      const splitCharacter = (bboxKeyword === 'ocr_par' || bboxKeyword === 'ocr_carea')  ?  '"' : ';'; 
      const bboxPart = line.split('bbox')[1]?.split(splitCharacter)[0]?.trim() || "";

      const bboxValues = bboxPart.split(' ').map(value => value.trim()).map(value => {
        const num = Number(value);
        if (isNaN(num)) {
          //extra logging would be helpful just in case we encounter non numeric values
          console.error('Non-numeric value found:', value); 
        }
        return num;
      });
      
    
      // Ensuring there are exactly 4 values
      if (bboxValues.length === 4) {  
        const [x_min, y_min, x_max, y_max] = bboxValues;
        bboxes.push({ x_min, y_min, x_max, y_max });
      } else {
        console.log('Unexpected bbox format:', bboxPart);
      }
    }
    
  });

  console.log('Final BBOXES:', bboxes);
  return bboxes;
};

const isValidImage = (base64) => {
  const mimeType = base64.split(';')[0].split(':')[1];
  return mimeType && mimeType.startsWith('image/');
};