import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { withAdminAuth } from '../../../utils/withAdminAuth';
import MediaLibrary from '../../../../components/admin/media_library/MediaLibrary';
import styles from '../AdminDashboard.module.css';

interface AdminMediaProps {
  admin: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export default function AdminMedia({ admin }: AdminMediaProps) {
  return (
    <>
      <Head>
        <title>Media Library | Admin Dashboard</title>
        <meta name="description" content="Manage your website media" />
      </Head>

      <div className={styles.adminContainer}>
        <div className={styles.adminHeader}>
          <h1>Media Library</h1>
          <div className={styles.adminMeta}>
            <p>Manage your website's images and videos</p>
          </div>
        </div>

        <MediaLibrary />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return withAdminAuth(context);
};
