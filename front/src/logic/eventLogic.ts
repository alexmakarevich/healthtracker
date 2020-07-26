import { Basic } from "./sharedLogic";

export class Event extends Basic {
  timeStart: string = new Date().toISOString();
  timeEnd: string = new Date().toISOString();

  constructor(timeStart?: Event["timeStart"], timeEnd?: Event["timeEnd"]) {
    super();
    timeStart && (this.timeStart = timeStart);
    timeEnd && (this.timeEnd = timeEnd);
  }
}
