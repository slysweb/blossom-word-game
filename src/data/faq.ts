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
