import { formatAcftRegistration } from '../utils/Acft/acft';

export const ACFT_IMG_URL = (id: string) => `https://rotaer.s3.amazonaws.com/acft-img/${formatAcftRegistration(id)}.jpg`;
