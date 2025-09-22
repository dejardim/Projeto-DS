import { init } from '@paralleldrive/cuid2';
import { ENV } from './env';

export const createUniqueIdentifier = init({
    fingerprint: ENV.CUID_FINGERPRINT,
    length: 16,
});
