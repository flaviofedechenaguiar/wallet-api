export class DatePeriod {
  private date: Date;
  private numberOfDays: number;
  private lastDate?: Date;

  constructor(date: Date, numberOfDays: number) {
    this.date = new Date(date);
    this.numberOfDays = numberOfDays;
  }

  getNext(): Date {
    let nextDate = new Date(this.date);

    if (!this.lastDate) {
      this.lastDate = nextDate;
      return nextDate;
    }

    nextDate = new Date(this.lastDate);
    nextDate.setDate(this.lastDate.getDate() + this.numberOfDays);
    this.lastDate = nextDate;

    return nextDate;
  }
}
