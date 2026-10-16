// Only known YouTube URL shapes can become an embedded player.
export function youtubeVideoId(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return '';
    let id = '';
    if (url.hostname === 'youtu.be') id = url.pathname.slice(1);
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
      if (url.pathname === '/watch') id = url.searchParams.get('v') || '';
      else id = url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1] || '';
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : '';
  } catch { return ''; }
}
export function introVideoReady(intro) {
  if (intro.visible !== true || !intro.approved || !intro.video || !intro.transcript) return false;
  return Boolean(youtubeVideoId(intro.video) || intro.captions && (/^\/(?!\/)/.test(intro.video) || /^https:\/\//.test(intro.video)) && !/youtu(?:be\.com|\.be)/i.test(intro.video));
}
