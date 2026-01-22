import { Request, Response, NextFunction } from 'express';

export const requestTimer = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Store start time in request object
  (req as any).startTime = startTime;
  
  // Override res.json to log timing when response is sent
  const originalJson = res.json;
  res.json = function(body: any) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️  ${req.method} ${req.path} - ${duration}ms`);
    
    // Call original json method
    return originalJson.call(this, body);
  };
  
  next();
};

export const logSlowRequests = (threshold: number = 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      if (duration > threshold) {
        console.warn(`🐌 SLOW REQUEST: ${req.method} ${req.path} took ${duration}ms`);
      }
    });
    
    next();
  };
};