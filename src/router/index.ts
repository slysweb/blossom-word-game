import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import GameView from "@/views/GameView.vue";
import SolverView from "@/views/SolverView.vue";
import { applySeo } from "@/utils/seo";
import type { RouteSeo } from "@/utils/seo";
import { faqJsonLd } from "@/data/faq";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "game",
    component: GameView,
    meta: {
      seo: {
        title: "Blossom Word Game - Free Daily Word Hunt Puzzle",
        description:
          "Play Blossom Word Game free online. A new word hunt puzzle every day, just like Spelling Bee. Make words from the hive, score points, and reach Genius rank.",
        keywords:
          "blossom word game,spelling bee,blossom word,word game,puzzle game,daily word puzzle,word hunt",
        path: "/",
        jsonLd: faqJsonLd(),
      } satisfies RouteSeo,
    },
  },
  {
    path: "/solver",
    name: "solver",
    component: SolverView,
    meta: {
      seo: {
        title: "Blossom Solver - Word Finder for Blossom Word Game",
        description:
          "Find every possible word in the daily puzzle with the Blossom Solver. Enter the center and outer letters of any Blossom Word Game or Spelling Bee hive to reveal all answers.",
        keywords:
          "blossom solver,spelling bee solver,word finder,blossom word game,word game solver,puzzle solver",
        path: "/solver",
      } satisfies RouteSeo,
    },
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes,
});

router.afterEach((to) => {
  const seo = to.meta.seo as RouteSeo | undefined;
  if (seo) applySeo(seo);
});

export default router;
