'use client';

import React from 'react';

interface EmbedPlayerProps {
  url: string;
}

function EmbedPlayer({ url }: EmbedPlayerProps) {
  const ref = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;

    const handleIframeLoaded = () => {
      iframe.style.opacity = '1';
    };

    iframe.addEventListener('load', handleIframeLoaded);

    return () => {
      iframe.removeEventListener('load', handleIframeLoaded);
    };
  }, [url]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        backgroundColor: '#000',
        overflow: 'hidden',
      }}
    >
      <iframe
        ref={ref}
        src={url}
        width="100%"
        height="100%"
        allowFullScreen
        loading="eager"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        style={{
          opacity: 0,
          border: 'none',
          transition: 'opacity 0.25s ease',
        }}
        onLoad={() => {
          if (ref.current) {
            ref.current.style.opacity = '1';
          }
        }}
      />
    </div>
  );
}

export default EmbedPlayer;
