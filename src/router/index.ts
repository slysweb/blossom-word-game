import type { RouteRecordRaw } from "vue-router";
import GameView from "@/views/GameView.vue";
import SolverView from "@/views/SolverView.vue";
import ArchiveView from "@/views/ArchiveView.vue";
import AboutView from "@/views/AboutView.vue";
import PrivacyView from "@/views/PrivacyView.vue";
import TermsView from "@/views/TermsView.vue";
import type { RouteSeo } from "@/utils/seo";
import { faqJsonLd } from "@/data/faq";

export const routes: RouteRecordRaw[] = [
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
  {
    path: "/play/:date",
    name: "play",
    component: GameView,
    meta: {
      seo: {
        title: "Play a past puzzle - Blossom Word Game",
        description:
          "Play any past Blossom Word Game puzzle from the archive. Find the words, track your score, and reveal the answers.",
        path: "/play",
      } satisfies RouteSeo,
    },
  },
  {
    path: "/archive",
    name: "archive",
    component: ArchiveView,
    meta: {
      seo: {
        title: "Puzzle Archive - Blossom Word Game",
        description:
          "Browse and replay every past Blossom Word Game. Pick any day to play that puzzle and reveal the full answer list.",
        keywords:
          "blossom word game archive,past puzzles,spelling bee archive,daily word puzzle archive",
        path: "/archive",
      } satisfies RouteSeo,
    },
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
    meta: {
      seo: {
        title: "About - Blossom Word Game",
        description:
          "Learn about Blossom Word Game, a free daily word hunt puzzle inspired by Spelling Bee, including how it works, scoring, and credits.",
        path: "/about",
      } satisfies RouteSeo,
    },
  },
  {
    path: "/privacy",
    name: "privacy",
    component: PrivacyView,
    meta: {
      seo: {
        title: "Privacy Policy - Blossom Word Game",
        description:
          "How Blossom Word Game handles your data. No accounts, no tracking cookies - your progress is stored locally in your browser.",
        path: "/privacy",
      } satisfies RouteSeo,
    },
  },
  {
    path: "/terms",
    name: "terms",
    component: TermsView,
    meta: {
      seo: {
        title: "Terms of Use - Blossom Word Game",
        description:
          "The terms of use for Blossom Word Game, a free online word puzzle provided as is for personal entertainment.",
        path: "/terms",
      } satisfies RouteSeo,
    },
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];
