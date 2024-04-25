import React from 'react';
import Navigation from '@/components/common/navigations/navMain';
import AlertTest from '@/components/home/alertTest';
import MainTeams from '@/components/home/mainTeams';
import CssTest from '@/components/home/cssTest';

export default function HomePage() {
  return (
    <div>
      <Navigation />
      <div className="content">
        <MainTeams />
        <AlertTest />
        <CssTest />
      </div>
    </div>
  );
}
