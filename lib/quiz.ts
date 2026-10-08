import type { CardData } from "@/data/cards";
import type { QuizQuestion } from "@/data/quiz";

export function quizBankForFamily(bank: QuizQuestion[], cards: CardData[], familyId: string | null): QuizQuestion[] {
  const eligible = new Set(cards.filter((card) => !familyId || card.familyId === familyId).map((card) => card.id));
  return bank.filter((question) => eligible.has(question.card));
}
