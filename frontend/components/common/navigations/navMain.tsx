'use client';

import Image from 'next/image';
import React from 'react';
import { Layout } from 'antd';
import Link from 'next/link';
import LoginComponent from '@/components/common/login';
import { DoubleLeftOutlined } from '@ant-design/icons';
import styles from './navMain.module.scss';

export default function HomePage() {
  const { Header } = Layout;

  return (
    <Layout style={{ backgroundColor: '#FFFFFF' }}>
      <Header className={styles.header} style={{height: '12vh', minHeight: '90px'}}>
        <div className={styles.leftSection}>
          <Link href="/welcome" className={styles.introLink}>
            <DoubleLeftOutlined className={styles.icon} /> INTRO
          </Link>
        </div>
        <div className={styles.centerSection}>
          <Link href="/">
            <Image src="/svgs/logo.svg" alt="로고" width={200} height={150} priority className={styles.logo} />
          </Link>
        </div>
        <div className={styles.rightSection}>
          <LoginComponent />
        </div>
      </Header>
    </Layout>
  );
}
