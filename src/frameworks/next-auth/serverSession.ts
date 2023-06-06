import { getServerSession } from 'next-auth';
import { authOptions } from '../../app/api/auth/[...nextauth]/route';

export const serverSession = async () => {
  const sess = await getServerSession(authOptions);
  return {
    isAuthenticated: !!sess,
    user: sess?.user,
    expires: sess?.expires,
  };
};
