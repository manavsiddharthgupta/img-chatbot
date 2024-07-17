import { Router } from 'express';
const router = Router();
import { createWorker } from 'tesseract.js';
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  imagePath: String,
  extractedText: String,
  userInputText: String,
  createdAt: { type: Date, default: Date.now },
});

const ImageAnalysis = mongoose.model('Image', imageSchema);

const analyzeImage = async (req, res) => {
  try {
    const { imageUrl, textInput, useAI } = req.body;
    if (!imageUrl) {
      throw new Error('Invalid Image Url');
    }
    if (useAI) {
      res.json({
        message: 'Image analysis using AI',
        data: null,
      });
    } else {
      const worker = await createWorker('eng');
      const response = await worker.recognize(imageUrl);
      await worker.terminate();

      const imgData = await ImageAnalysis.create({
        imagePath: imageUrl,
        extractedText: response.data.text,
        userInputText: textInput,
      });
      console.log(imgData);
      res.json({
        message: 'Image analysis using OCR',
        data: {
          imagePath: imgData.imagePath,
          extractedText: imgData.extractedText,
          userInputText: imgData.userInputText,
        },
      });
    }
  } catch (error) {
    console.error('Error in image analysis:', error);
    res.status(500).json({ error: `Error in image analysis: ${error}` });
  }
};

async function getImageAnalysis(req, res) {
  try {
    const allImageAnalyses = await ImageAnalysis.find();

    res.json({
      message: 'Image analyses retrieved successfully',
      data: allImageAnalyses.map((img) => ({
        id: img._id,
        imagePath: img.imagePath,
        extractedText: img.extractedText,
        userInputText: img.userInputText,
        createdAt: img.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error retrieving image analyses:', error);
    res.status(500).json({
      message: 'Error retrieving image analyses',
      error: error.message,
    });
  }
}

router.get('/imganalysis', getImageAnalysis);
router.post('/imganalysis', analyzeImage);

export default router;
