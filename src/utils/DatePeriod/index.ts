import { TypePeriod } from './type-period.enum';

export class DatePeriod {
  private date: Date;
  private period: number;
  private lastDate?: Date;

  constructor(date: Date, period: TypePeriod) {
    this.date = new Date(date);
    this.period = period;
  }

  getNext(): Date {
    let nextDate = new Date(this.date);

    if (!this.lastDate) {
      this.lastDate = nextDate;
      return nextDate;
    }

    nextDate = new Date(this.lastDate);
    nextDate.setDate(this.lastDate.getDate() + this.period);
    this.lastDate = nextDate;

    return nextDate;
  }
}
