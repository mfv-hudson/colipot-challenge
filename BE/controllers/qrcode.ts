import QRCode from 'qrcode';
import { Request, Response } from 'express';

export const generateQRCode = async (req: Request, res: Response) => {
  const { text } = req.query;
  const qrCode = await QRCode.toDataURL(text as string);
  res.send(`<img src="${qrCode}">`);
};
