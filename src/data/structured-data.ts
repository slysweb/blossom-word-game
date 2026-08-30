import { SITE_URL } from "@/utils/seo";
import { faqs } from "@/data/faq";

export const WEBSITE_ID = `${SITE_URL}/#website`;

const freeOffer = {
  "@type": "Offer",
  price: "0",
  priceCurrency: "USD",
};

function faqMainEntity(items: { question: string; answer: string }[]) {
  return items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));
}

/** Homepage: game app + site FAQ. */
export function homeJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#app`,
        name: "Blossom Word Game",
        url: `${SITE_URL}/`,
        applicationCategory: "GameApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        description:
          "Play Blossom Word Game free online. Daily word hunt — reach Genius and bloom every flower in the daily challenge.",
        image: `${SITE_URL}/og.png`,
        offers: freeOffer,
        isPartOf: { "@id": WEBSITE_ID },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faqMainEntity(faqs),
      },
    ],
  };
}

const solverFaqs = [
  {
    question: "What is the Blossom Solver?",
    answer:
      "The Blossom Solver is a free word finder for any 7-letter hive — Blossom Word Game, NYT Spelling Bee, or Merriam-Webster Blossom. Enter the center letter and six outer letters to list every valid word, including pangrams.",
  },
  {
    question: "How does the Blossom Solver work?",
    answer:
      "A hive uses seven unique letters with one required center letter. Enter them and the solver returns every word that is at least four letters long, contains the center letter, and uses only those seven letters. Words that use all seven letters are pangrams.",
  },
  {
    question: "Why might solver results differ from other games?",
    answer:
      "Results come from our own word list. Other games such as the NYT Spelling Bee and Merriam-Webster Blossom use different dictionaries, so a word we list may not be accepted there (and vice versa).",
  },
];

/** Solver page: tool app + page metadata + solver FAQ. */
export function solverJsonLd(): object {
  const pageUrl = `${SITE_URL}/solver`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Blossom Solver - Word Finder for Blossom Word Game",
        description:
          "Find every possible word in the daily puzzle with the Blossom Solver. Enter the center and outer letters of any Blossom Word Game or Spelling Bee hive to reveal all answers.",
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: "en",
      },
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#app`,
        name: "Blossom Solver",
        url: pageUrl,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        description:
          "Free word finder for Blossom Word Game, NYT Spelling Bee, and similar 7-letter hives. Enter center and outer letters to reveal every valid word and pangram.",
        image: `${SITE_URL}/og.png`,
        offers: freeOffer,
        isPartOf: { "@id": WEBSITE_ID },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faqMainEntity(solverFaqs),
      },
    ],
  };
}
