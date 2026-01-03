import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  pagination?: ApiResponse['pagination']
): void => {
  const response: ApiResponse<T> = {
    success: statusCode < 400,
    message,
    ...(data && { data }),
    ...(pagination && { pagination })
  };

  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: any[]
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors })
  };

  res.status(statusCode).json(response);
};

export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};