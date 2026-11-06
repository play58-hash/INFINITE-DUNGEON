// INFINITE DUNGEON 푸시 알림용 서비스 워커
// index.html과 같은 폴더에 올려 주세요. 게임 화면이나 데이터를 저장하지 않고, 알림만 띄웁니다.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "INFINITE DUNGEON", {
    body: d.body || "",
    tag: d.tag || "id-push",
    renotify: true,
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    data: { url: d.url || "#/home" },
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const hash = (e.notification.data && e.notification.data.url) || "#/home";
  const target = new URL(hash, self.registration.scope).href;
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of list) {
      if (c.url.startsWith(self.registration.scope)) {
        try { await c.navigate(target); } catch {}
        return c.focus();
      }
    }
    return self.clients.openWindow(target);
  })());
});
