import { siteConfig } from '@/configs/site';
import React from 'react';
import MainNav from '@/components/navigation/main-nav';

const SiteHeader = () => {
  return (
    <header className="supports-[backdrop-filter]:bg-background/55 sticky top-0 z-50 border-b border-white/10 bg-background/75 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <MainNav items={siteConfig.mainNav} />
    </header>
  );
};

export default SiteHeader;
