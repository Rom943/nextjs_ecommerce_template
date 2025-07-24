import { GetServerSidePropsContext } from 'next';
import { verifyToken } from './jwt';
import { prisma } from '../../lib/prisma';

export async function withAdminAuth(context: GetServerSidePropsContext) {
  const { req, res } = context;
  const token = req.cookies.admin_token;

  if (!token) {
    return {
      redirect: {
        destination: '/admin_login',
        permanent: false,
      },
    };
  }

  try {
    // Verify the token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return {
        redirect: {
          destination: '/admin_login',
          permanent: false,
        },
      };
    }

    // Check if admin exists in database
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, firstName: true, lastName: true }
    });

    if (!admin) {
      return {
        redirect: {
          destination: '/admin_login',
          permanent: false,
        },
      };
    }

    // Token is valid, continue
    return {
      props: {
        admin: {
          id: admin.id,
          email: admin.email,
          firstName: admin.firstName || null,
          lastName: admin.lastName || null,
        },
      },
    };
  } catch (error) {
    // Invalid token or error
    return {
      redirect: {
        destination: '/admin_login',
        permanent: false,
      },
    };
  }
}
