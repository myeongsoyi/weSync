import type { Metadata } from 'next';
import Navigation from '@/components/common/navigations/navTeam';
import InnerNavigation from '@/components/team/innerNav';
import React from 'react';
import styles from './index.module.scss';


export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'Loading...',
  },
  description: '팀 페이지',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 네비를 포함한 레이아웃
  return (
    <div>
      <Navigation />
      <div className="content">
        <InnerNavigation />
        <div className={styles.innerBox}>
          {children}
        </div>
      </div>
    </div>
  );
}
