export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "What is Blossom Word Game?",
    answer:
      "Blossom Word Game is a free daily word hunt puzzle, similar to Spelling Bee. You are given a hive of seven letters and must create as many valid words as you can using those letters.",
  },
  {
    question: "How do I play?",
    answer:
      "Build words that are at least four letters long and always include the center letter. Letters can be reused as many times as you like. Type with your keyboard or tap the letters in the hive, then press Enter to submit.",
  },
  {
    question: "How is my score calculated?",
    answer:
      "Four-letter words are worth 1 point. Longer words earn 1 point per letter. A pangram, which uses all seven letters, earns its length plus 7 bonus points.",
  },
  {
    question: "What is a pangram?",
    answer:
      "A pangram is a word that uses every one of the seven available letters at least once. Each puzzle contains at least one pangram, and finding it gives a big point bonus.",
  },
  {
    question: "Is there a new puzzle every day?",
    answer:
      "Yes. A brand new puzzle is generated every day, and everyone plays the same daily hive. Your progress is saved in your browser, so you can come back and continue.",
  },
  {
    question: "What is the Blossom Solver?",
    answer:
      "The Blossom Solver is a built-in word finder. Enter the center letter and the six outer letters, and it lists every valid word for that combination to help you when you are stuck.",
  },
  {
    question: "Is Blossom Word Game free?",
    answer:
      "Yes, the game is completely free to play online with unlimited puzzles, and no account or download is required.",
  },
  {
    question: "What does the share text mean?",
    answer:
      "Share your result copies a short, spoiler-free summary. Line 1 is the puzzle number. Line 2 shows rank progress toward Genius in ten slots: each 🌸 is progress made, each 🌱 is still to go, followed by your rank name (for example, Good Start with 2 🌸 and 8 🌱 means 20% progress). This bar is separate from Today's Challenge flowers. Line 3 shows words found, total words, and your score. Line 4 is a link to the game. Completing Today's Challenge adds a note about bloomed challenge flowers.",
  },
  {
    question: "How do I clear my history or progress?",
    answer:
      "All saved data stays in your browser's local storage — we do not store it on a server. To reset everything for blossomword.com, open your browser settings and clear site data (sometimes called cookies and site data) for this website. That removes found words, scores, challenge progress, and theme preference. In Chrome: Settings → Privacy and security → Delete browsing data → choose Cookies and other site data, or use \"See all site data and permissions\" and remove blossomword.com. In Safari: Settings → Privacy → Manage Website Data. In Firefox: Settings → Privacy & Security → Cookies and Site Data → Manage Data. After clearing, reload the page and you will start fresh.",
  },
  {
    question: "How is Blossom Word Game different from Merriam-Webster's Blossom?",
    answer:
      "Blossom Word Game is based on the New York Times Spelling Bee — Merriam-Webster's Blossom draws from the same kind of puzzle too. The first version of this site was built on the open-source Spelling Bee project by Conor Sheehan (github.com/ConorSheehan1/spelling-bee). We were creatively inspired by Merriam-Webster's Blossom, but our question bank, Today's Challenge rules, and page design are entirely our own. Our daily challenge — blooming flowers with different petal counts as you find words of each length — is an original feature created for blossomword.com.",
  },
  {
    question: "What time does the daily puzzle update?",
    answer:
      "A new puzzle becomes available at midnight US Eastern Time (America/New_York). That is when the calendar day changes in the game's reference timezone, so everyone sees the same daily hive once that date begins in Eastern Time.",
  },
];

export function faqJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
