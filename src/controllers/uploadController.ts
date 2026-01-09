import { Request, Response } from 'express';

export const uploadLogo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const logoUrl = `/uploads/${req.file.filename}`;

    res.json({ 
      success: true, 
      data: { 
        logoUrl,
        fileName: req.file.originalname
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};