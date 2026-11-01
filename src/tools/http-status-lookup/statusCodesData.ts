import { STATUS_CODES_1XX_3XX, HttpStatusCode, StatusCategory } from './statusCodes1xxTo3xx';
import { STATUS_CODES_4XX_5XX } from './statusCodes4xxTo5xx';

export type { HttpStatusCode, StatusCategory };

export const STATUS_CODES: HttpStatusCode[] = [...STATUS_CODES_1XX_3XX, ...STATUS_CODES_4XX_5XX];
