export const playerConfig = {
  baseUrl: 'https://vidsrc.sbs',
} as const;

export function buildPlayerUrl(type: 'movie' | 'tv', id: string | number) {
  return `${playerConfig.baseUrl}/embed/${type}/${id}`;
}
