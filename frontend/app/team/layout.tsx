import type { Metadata } from 'next';
import Navigation from '@/components/common/navigations/navMain';
import InnerNavigation from '@/components/team/innerNav';
import React from 'react';


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
        {children}
      </div>
    </div>
  );
}
