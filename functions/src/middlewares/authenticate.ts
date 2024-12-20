import {Request, Response, NextFunction} from 'express';
import * as admin from 'firebase-admin';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({message: 'Unauthorized: Missing token'});
    return;
  }

  const token = authHeader.split(' ')[1]; // Extract token from header
  console.log('Received Authorization Header:', authHeader);
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      res.status(401).json({message: 'Unauthorized: Token expired'});
      return;
    }

    res.locals.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({message: 'Unauthorized: Invalid token'});
  }
};
