import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'We Sync | 위싱',
  description: '소개 페이지',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 푸터를 포함한 레이아웃
  return <div>{children}</div>;
}
