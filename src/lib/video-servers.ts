export type VideoServer = {
  id: string;
  name: string;
  baseUrl: string;
  enabled: boolean;
};

export const VIDEO_SERVERS: VideoServer[] = [
  { id: 'server-1', name: 'Server 1', baseUrl: 'https://vidsrc.sbs', enabled: true },
  { id: 'server-2', name: 'Server 2', baseUrl: 'https://vidsrc2.ru', enabled: true },
  { id: 'server-3', name: 'Server 3', baseUrl: 'https://vidsrc.ir', enabled: true },
  { id: 'server-4', name: 'Server 4', baseUrl: 'https://vidsrcme.ru', enabled: true },
  { id: 'server-5', name: 'Server 5', baseUrl: 'https://vidsrcme.su', enabled: true },
  { id: 'server-6', name: 'Server 6', baseUrl: 'https://vidsrc-me.ru', enabled: true },
  { id: 'server-7', name: 'Server 7', baseUrl: 'https://vidsrc-me.su', enabled: true },
  { id: 'server-8', name: 'Server 8', baseUrl: 'https://vidsrc-embed.ru', enabled: true },
  { id: 'server-9', name: 'Server 9', baseUrl: 'https://vidsrc-embed.su', enabled: true },
  { id: 'server-10', name: 'Server 10', baseUrl: 'https://vsrc.su', enabled: true },
];

export function getEnabledVideoServers() {
  const disabled = new Set(
    (process.env.NEXT_PUBLIC_DISABLED_VIDEO_SERVERS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );
  return VIDEO_SERVERS.map((server) => ({
    ...server,
    enabled: server.enabled && !disabled.has(server.id),
  })).filter((server) => server.enabled);
}

export function getDefaultVideoServer() {
  const enabledServers = getEnabledVideoServers();
  return (
    enabledServers.find(
      (server) => server.id === process.env.NEXT_PUBLIC_DEFAULT_VIDEO_SERVER,
    ) ?? enabledServers[0]
  );
}

export function buildVideoEmbedUrl(
  server: VideoServer,
  media: { type: 'movie'; id: string | number } | { type: 'tv'; id: string | number; season?: string | number; episode?: string | number },
) {
  if (media.type === 'movie') {
    return `${server.baseUrl}/embed/movie/${media.id}`;
  }

  return `${server.baseUrl}/embed/tv/${media.id}/${media.season ?? 1}/${media.episode ?? 1}`;
}
