export type VideoServer = {
  id: string;
  name: string;
  baseUrl: string;
  enabled: boolean;
};

export const VIDEO_SERVERS: VideoServer[] = [
  {
    id: 'main',
    name: 'Main Server',
    baseUrl: 'https://vidsrc.sbs',
    enabled: true,
  },
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
  media:
    | { type: 'movie'; id: string | number }
    | {
        type: 'tv';
        id: string | number;
        season?: string | number;
        episode?: string | number;
      },
) {
  if (media.type === 'movie') {
    return `${server.baseUrl}/embed/movie/${media.id}`;
  }

  return `${server.baseUrl}/embed/tv/${media.id}/${media.season ?? 1}/${
    media.episode ?? 1
  }`;
}
