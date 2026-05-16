import { z } from 'zod';
import type { XFile } from './index';

export interface ZFileOptions {
  mimes?: string[];
}

/**
 * Validates an XFile object.
 * Usage:
 * const schema = z.object({
 *   avatar: zFile({ mimes: ['image/jpeg', 'image/png'] })
 * });
 * 
 * const data = req.validate(schema);
 */
export const zFile = (options: ZFileOptions = {}) => {
  return z.custom<XFile>((val: any) => {
    if (!val || typeof val !== 'object') return false;
    if (!('fieldname' in val) || !('filename' in val) || !('mimetype' in val)) {
      return false;
    }
    
    if (options.mimes && options.mimes.length > 0) {
      if (!options.mimes.includes(val.mimetype)) {
        return false;
      }
    }
    
    return true;
  }, {
    message: options.mimes 
      ? `File must be of type: ${options.mimes.join(', ')}` 
      : 'Invalid file',
  });
};

export const validateFile = (file: XFile | undefined, options: ZFileOptions = {}): XFile => {
  if (!file) {
    throw new Error('File is missing');
  }

  if (options.mimes && options.mimes.length > 0) {
    if (!options.mimes.includes(file.mimetype)) {
      const err: any = new Error(`File must be of type: ${options.mimes.join(', ')}`);
      err.statusCode = 422;
      err.code = 'VALIDATION_ERROR';
      throw err;
    }
  }

  return file;
};


