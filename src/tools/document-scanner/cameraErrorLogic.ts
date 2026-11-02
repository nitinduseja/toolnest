export type CameraErrorType = 'denied' | 'notfound' | 'inuse' | 'insecure' | 'other';

export function classifyCameraError(err: unknown): {
  type: CameraErrorType;
  message: string;
} {
  if (err instanceof Error) {
    const name = err.name.toLowerCase();
    const msg = err.message.toLowerCase();

    if (name.includes('notallowed') || name.includes('permission') || msg.includes('denied')) {
      return {
        type: 'denied',
        message: 'Camera permission was denied in your browser or operating system.',
      };
    }
    if (name.includes('notfound') || name.includes('devicesnotfound') || msg.includes('found')) {
      return {
        type: 'notfound',
        message: 'No camera hardware found on this device.',
      };
    }
    if (name.includes('notreadable') || name.includes('trackstart') || msg.includes('in use')) {
      return {
        type: 'inuse',
        message: 'Camera is currently in use by another app or browser tab.',
      };
    }
    if (msg.includes('secure') || msg.includes('https') || msg.includes('context')) {
      return {
        type: 'insecure',
        message: 'Camera requires a secure HTTPS or localhost connection.',
      };
    }
    return { type: 'other', message: err.message };
  }

  if (typeof err === 'string' && err.toLowerCase().includes('secure')) {
    return {
      type: 'insecure',
      message: 'Camera requires a secure HTTPS or localhost connection.',
    };
  }

  return { type: 'other', message: 'Unable to access camera.' };
}
