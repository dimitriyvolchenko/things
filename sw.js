/* Planner room: separate scope, separate cache; never cache plan/API responses. */
const CACHE='planner-room-shell-1.0.0';
const ROOT=new URL('./',self.location.href);
const FILES=["./", "index.html", "room.css", "manifest.webmanifest", "assets/room/parallel.svg", "assets/room/room-512.png", "assets/room/focus.svg", "assets/room/room.svg", "assets/room/rest.svg", "assets/room/room-180.png", "assets/room/room-192.png", "assets/room/flow.svg", "assets/room/tasks.svg", "assets/room/cloud.svg", "assets/room/today.svg", "assets/room/desk.svg", "assets/room/launch.svg", "assets/room/done.svg", "assets/room/room-32.png", "assets/icons/planner-check-180.png", "assets/icons/planner-sweep-512.png", "assets/icons/planner-sweep-32.png", "assets/icons/planner-sweep-180.png", "assets/icons/planner-check-512.png", "assets/icons/planner-sweep-192.png", "assets/icons/planner-check-192.png", "assets/icons/planner-check-32.png"];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(FILES.map(p=>new Request(new URL(p,ROOT),{cache:'reload'})));await self.skipWaiting();})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{await Promise.all((await caches.keys()).filter(k=>k.startsWith('planner-room-shell-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==ROOT.origin||!u.pathname.startsWith(ROOT.pathname))return;
const rel=u.pathname.slice(ROOT.pathname.length);if(rel==='refresh.html'||/progress.*\.json$/i.test(rel))return;
if(!FILES.includes(rel)&&rel!=='')return;
e.respondWith((async()=>{const c=await caches.open(CACHE);const key=new URL(rel||'index.html',ROOT).href;try{const res=await fetch(new Request(r,{cache:'no-cache'}));if(res.ok)await c.put(key,res.clone());return res;}catch(err){const hit=await c.match(key);if(hit)return hit;throw err;}})());});
