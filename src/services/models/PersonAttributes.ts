import { autoserialize } from "cerialize";

export class PersonAttributes {
  @autoserialize
  cardType?: string;
  @autoserialize
  cardId?: string;
  @autoserialize
  cardLimit?: number;
  @autoserialize
  currentExchange?: number;
  @autoserialize
  openDate?: string;
  @autoserialize
  closeDate?: string;
  @autoserialize
  cycleLimit?: number;
  @autoserialize
  spendingLimit?: number;
  @autoserialize
  personAgent?: string;
  @autoserialize
  levelFour?: string;
  @autoserialize
  levelFive?: string;
  @autoserialize
  billingOfficial?: Array<string>;
}
