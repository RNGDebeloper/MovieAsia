import Link from 'next/link';

export default function AnnouncementBanner() {
  const title = process.env.NEXT_PUBLIC_ANNOUNCEMENT_TITLE;
  const message = process.env.NEXT_PUBLIC_ANNOUNCEMENT_MESSAGE;
  const href = process.env.NEXT_PUBLIC_ANNOUNCEMENT_LINK;
  if (!title && !message) return null;
  const content = <><strong>{title}</strong>{message ? <span className="ml-2 text-white/75">{message}</span> : null}</>;
  return <div className="border-b border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-center text-sm text-white">{href ? <Link href={href}>{content}</Link> : content}</div>;
}
