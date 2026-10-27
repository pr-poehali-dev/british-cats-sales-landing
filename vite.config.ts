import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import {componentTagger} from "pp-tagger";

// HMR-сокет превью рвёт инфраструктура: ingress-nginx на каждом reload
// конфига (захват/освобождение любого dev-пода) через 30 с закрывает все
// соединения старых воркеров; DDoS Guard режет «тихие» соединения. Сам vite
// на любой обрыв перезагружает страницу. Плагин держит превью живым:
// - сервер шлёт состояние «boot:seq» сразу после каждой рассылки клиентам
//   (update, full-reload, error...) и раз в 5-9 с — это и двусторонний
//   keepalive для DDoS Guard (рандом — чтобы не ловить его фильтр одинаковых
//   интервалов). boot меняется на рестарте vite, seq — на каждой рассылке;
// - клиент (скрипт в index.html) подменяет сокет vite-hmr «вечным»: на
//   обрыве тихо переподключается и перезагружает страницу, только если за
//   время разрыва сервер рестартовал или что-то разослал. Не переподключился
//   с трёх попыток — отдаёт обрыв vite, дальше как раньше (ждёт сервер и
//   перезагружает).
// Клиентский ping понижен до 7 с через server.hmr.timeout ниже.
//
// Самовосстановление. В dev страница — это ~100 отдельных модулей, и один
// сорванный запрос (502 ingress на reload, обрыв HTTP/2 на плохой сети) роняет
// весь граф src/main.tsx: React не монтируется, экран пустой до F5. Скрипт сам
// перезагружает превью, если не загрузился модуль или стиль своего сайта либо
// не прошёл динамический import. Перед перезагрузкой ждёт, пока страница снова
// отвечает 200 (сервер лежит — ждём, а не крутим reload), и растит паузу
// 1 → 2 → 4 … 60 с (счётчик в sessionStorage, сбрасывается через 10 с после
// load) — битый код не уводит превью в цикл. Тот же блок — в шаблоне TanStack
// (src/platform/dev-hmr.ts).
const hmrClient = `(() => {
    const NativeWebSocket = WebSocket;
    class HmrSocket extends EventTarget {
        OPEN = 1;
        readyState = 0;
        state = "";
        queue = [];
        constructor(url, protocols) {
            super();
            this.url = url;
            this.protocols = protocols;
            this.connect(0);
        }
        connect(attempt) {
            const ws = this.ws = new NativeWebSocket(this.url, this.protocols);
            let fresh = true;
            ws.onopen = () => {
                attempt = 0;
                this.queue.splice(0).forEach((data) => ws.send(data));
                if (this.readyState === 0) {
                    this.readyState = 1;
                    this.dispatchEvent(new Event("open"));
                }
            };
            ws.onmessage = (event) => {
                if (event.data.includes('"ezst:hmr"')) {
                    const state = JSON.parse(event.data).data;
                    if (fresh && this.state && this.state !== state) return location.reload();
                    fresh = false;
                    this.state = state;
                }
                this.dispatchEvent(new MessageEvent("message", {data: event.data}));
            };
            ws.onclose = (event) => {
                if (this.readyState === 3) return;
                if (!this.state || attempt === 3) {
                    this.readyState = 3;
                    return this.dispatchEvent(new CloseEvent("close", event));
                }
                setTimeout(() => this.connect(attempt + 1), attempt * 1000);
            };
        }
        send(data) {
            if (this.ws.readyState === 1) this.ws.send(data);
            else this.queue.push(data);
        }
        close(code, reason) {
            this.readyState = 3;
            this.ws.close(code, reason);
        }
    }
    window.WebSocket = new Proxy(NativeWebSocket, {
        construct: (target, args) => args[1] === "vite-hmr" ? new HmrSocket(...args) : new target(...args),
    });

    const KEY = "ezst:recover";
    const attempts = () => {
        try {
            return Number(sessionStorage.getItem(KEY)) || 0;
        } catch {
            return 3;
        }
    };
    const setAttempts = (n) => {
        try {
            sessionStorage.setItem(KEY, String(n));
        } catch {}
    };
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const pause = (n) => Math.min(60000, 1000 * 2 ** n);
    const answers = () => fetch(location.href, {cache: "no-store"}).then((r) => r.ok, () => false);
    let recovering = false;
    const recover = async (reason) => {
        if (recovering) return;
        recovering = true;
        const n = attempts();
        console.warn("[ezst] превью не загрузилось (" + reason + "), перезагрузка через " + pause(n) / 1000 + " с");
        await sleep(pause(n));
        for (let i = 0; !(await answers()); i++) await sleep(pause(i));
        setAttempts(n + 1);
        location.reload();
    };
    const failedImport = (message) => /dynamically imported module|Importing a module script failed/.test(message || "");
    const own = (url) => !!url && new URL(url, location.href).origin === location.origin;
    window.addEventListener("pagehide", () => recovering = true);
    window.addEventListener("error", (event) => {
        const el = event.target;
        const module = el instanceof HTMLScriptElement && el.type === "module" && own(el.src);
        const link = el instanceof HTMLLinkElement && ["modulepreload", "stylesheet"].includes(el.rel) && own(el.href);
        if (module || link) return recover("не загрузился " + (el.src || el.href));
        if (failedImport(event.message)) recover(event.message);
    }, true);
    window.addEventListener("unhandledrejection", (event) => {
        const message = String(event.reason?.message || event.reason);
        if (failedImport(message)) recover(message);
    });
    window.addEventListener("vite:preloadError", () => recover("vite:preloadError"));
    window.addEventListener("load", () => setTimeout(() => recovering || setAttempts(0), 10000));
})();`;

const hmrKeepalive = {
    name: 'hmr-ws-keepalive',
    apply: 'serve' as const,
    configureServer(server: any) {
        const boot = Date.now().toString(36);
        let seq = 0;
        const state = () => ({type: 'custom', event: 'ezst:hmr', data: `${boot}:${seq}`});
        const broadcast = server.ws.send.bind(server.ws);
        server.ws.send = (...args: any[]) => {
            seq++;
            broadcast(...args);
            broadcast(state());
        };
        server.ws.on('connection', (socket: any) => socket.send(JSON.stringify(state())));
        let timer: ReturnType<typeof setTimeout> | null = null;
        const tick = () => {
            broadcast(state());
            timer = setTimeout(tick, 5000 + Math.floor(Math.random() * 4000));
        };
        timer = setTimeout(tick, 5000 + Math.floor(Math.random() * 4000));
        server.httpServer?.on('close', () => {
            if (timer) clearTimeout(timer);
        });
    },
    transformIndexHtml: () => [{tag: 'script', children: hmrClient, injectTo: 'head-prepend' as const}],
};

// https://vitejs.dev/config/
export default defineConfig(({mode}) => ({
    plugins: [
        react(),
        hmrKeepalive,
        mode === 'development' &&
        componentTagger(),
    ].filter(Boolean),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        allowedHosts: true,
        hmr: {
            overlay: false, // Disables the error overlay if you only want console errors
            timeout: 7000, // pingInterval @vite/client — нужен <30s для DDoS Guard
        }
    },
}));
