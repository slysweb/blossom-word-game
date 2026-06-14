import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import GameView from "@/views/GameView.vue";
import SolverView from "@/views/SolverView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "game",
    component: GameView,
    meta: {
      title: "Blossom Word Game",
      description:
        "Blossom word game online for free. Every day a new word hunt puzzle game.",
      keywords:
        "blossom word game,spelling bee,blossom word,word game,puzzle game",
      canonical: "https://blossomwordgame.com",
    },
  },
  {
    path: "/solver",
    name: "solver",
    component: SolverView,
    meta: {
      title: "Blossom Solver - Word Finder for Blossom Word Game",
      description:
        "Blossom word game online for free with Blossom Solver. Find all possible words in the daily puzzle or use our solver to help you find solutions.",
      keywords:
        "blossom word game,blossom solver,spelling bee solver,word finder,word game solver,puzzle solver",
      canonical: "https://blossomwordgame.com/solver",
    },
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function setMeta(name: string, content: string): void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

router.afterEach((to) => {
  const meta = to.meta as Record<string, string>;
  if (meta.title) document.title = meta.title;
  if (meta.description) setMeta("description", meta.description);
  if (meta.keywords) setMeta("keywords", meta.keywords);
  if (meta.canonical) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", meta.canonical);
  }
});

export default router;
