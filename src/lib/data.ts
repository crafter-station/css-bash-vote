import { CHALLENGES } from "../data/challenges";
import summaryRaw from "../data/summary.json";

export interface Judgement {
  challengeId: string;
  left: {
    primitive: string;
    constraints: number;
    idiomatic: number;
    visual: number;
    reasoning: string;
  };
  right: {
    primitive: string;
    constraints: number;
    idiomatic: number;
    visual: number;
    reasoning: string;
  };
  winner: "left" | "right" | "tie";
  verdict: string;
}

export interface VariantSide {
  left: string;
  right: string;
}

export interface SummaryData {
  judgements: Judgement[];
  variantSides: Record<string, VariantSide>;
}

const summary = summaryRaw as SummaryData;

export function getChallenges() {
  return CHALLENGES;
}

export function getJudgements(): Judgement[] {
  return summary.judgements;
}

export function getVariantSides(): Record<string, VariantSide> {
  return summary.variantSides;
}
