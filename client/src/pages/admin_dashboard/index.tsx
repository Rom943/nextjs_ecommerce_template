

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { withAdminAuth } from '../../utils/withAdminAuth';
import Head from 'next/head';
import Link from 'next/link';
import styles from './AdminDashboard.module.css';

type AdminDashboardProps = {
  admin: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
};

export default function AdminDashboard({ admin }: AdminDashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      });
      router.push('/admin_login');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Admin Dashboard</h1>
            <div className={styles.userInfo}>
              <span>Logged in as: {admin.email}</span>
              <button 
                onClick={handleLogout}
                disabled={loading}
                className={styles.logoutButton}
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </header>
        
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <nav className={styles.nav}>
              <ul className={styles.navList}>
                <li className={styles.navItem}>
                  <Link href="/admin_dashboard" className={styles.navLink}>Dashboard</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/admin_dashboard/media" className={styles.navLink}>Media Library</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="#" className={styles.navLink}>Products</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="#" className={styles.navLink}>Orders</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="#" className={styles.navLink}>Customers</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="#" className={styles.navLink}>Settings</Link>
                </li>
              </ul>
            </nav>
          </aside>
          
          <main className={styles.main}>
            <div className={styles.welcomeCard}>
              <h2>Welcome to the Admin Dashboard</h2>
              <p>This is a protected page that only authenticated admins can access.</p>
            </div>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Total Orders</h3>
                <p className={styles.statValue}>0</p>
              </div>
              <div className={styles.statCard}>
                <h3>Total Products</h3>
                <p className={styles.statValue}>0</p>
              </div>
              <div className={styles.statCard}>
                <h3>Total Customers</h3>
                <p className={styles.statValue}>0</p>
              </div>
              <div className={styles.statCard}>
                <h3>Total Revenue</h3>
                <p className={styles.statValue}>$0.00</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withAdminAuth;
