import SiteFooter from '@/components/main/site-footer';
import SiteHeader from '@/components/main/site-header';
import AnnouncementBanner from '@/components/announcement-banner';

// These routes fetch live TMDB data through a server-only credential. Keeping
// them dynamic prevents Next.js from making authenticated TMDB calls at build.
export const dynamic = 'force-dynamic';

const FrontLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <AnnouncementBanner />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
};

export default FrontLayout;
