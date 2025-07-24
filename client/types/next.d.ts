import { JwtPayload } from '../src/utils/jwt';

declare module 'next' {
  export interface NextApiRequest {
    admin?: {
      id: number;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      role: string;
    };
  }
}
