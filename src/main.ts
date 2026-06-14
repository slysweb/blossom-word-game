import { ViteSSG } from "vite-ssg";
import { createPinia } from "pinia";
import App from "@/App.vue";
import { routes } from "@/router";
import { i18n } from "@/i18n";
import "@/assets/styles/main.scss";

// ViteSSG prerenders each route to static HTML at build time, then hydrates
// on the client. Head tags are managed via @unhead/vue so they appear in the
// prerendered HTML (good for SEO and link previews).
export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior: () => ({ top: 0 }) },
  ({ app }) => {
    app.use(createPinia());
    app.use(i18n);
  },
);
