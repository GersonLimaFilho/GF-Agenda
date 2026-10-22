/* GF Agenda V4.4 — Service Worker para Web Push. Não armazena dados da agenda. */
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) { data = { body: event.data ? event.data.text() : '' }; }
  const title = typeof data.title === 'string' ? data.title : 'GF Agenda';
  const options = {
    body: typeof data.body === 'string' ? data.body : 'Você tem pendências na agenda.',
    icon: './apple-touch-icon.png', badge: './apple-touch-icon.png',
    tag: data.tag || 'gf-agenda-resumo-diario',
    data: { url: './' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const url = new URL('./', self.registration.scope).href;
    const windows = await clients.matchAll({type:'window',includeUncontrolled:true});
    for (const w of windows) {
      if (w.url.startsWith(self.registration.scope)) { await w.focus(); return; }
    }
    await clients.openWindow(url);
  })());
});
