// import { Transaction } from 'typeorm';
// import { TypeSplit } from '';
// import { DatePeriod } from 'src/utils/DatePeriod';
// import { TransactionStatus } from '../enums/transaction-status.enum';
//
// type BuildTransactionData = {
//   description: string;
//   date: Date;
//   amount: number;
//   note: string;
//   status: TransactionStatus;
//   split?: {
//     type: TypeSplit;
//     quantity: number;
//     period: number;
//   };
// };
//
// export class BuildTransactions {
//   build(data: BuildTransactionData): Transaction[] {
//     if (!data.split) {
//       return [this.createTransaction(data)];
//     }
//
//     const period = new DatePeriod(data.date, data.split.period);
//     const quantityOfSplits = new Array(data.split.quantity);
//     const amount = this.getTransactionAmount(
//       data.amount,
//       data.split.quantity,
//       data.split.type,
//     );
//     const transactions = quantityOfSplits.map(() => {
//       return this.createTransaction({
//         ...data,
//         amount: amount,
//         date: period.getNext(),
//       });
//     });
//
//     return transactions;
//   }
//
//   private createTransaction(data: BuildTransactionData): Transaction {
//     return new Transaction(
//       data.description,
//       data.date,
//       data.amount,
//       data.status,
//       data.note,
//     );
//   }
//
//   //ANCHOR: Corrigir implementacao de valor monetario
//   private getTransactionAmount(
//     amount: number,
//     quantity: number,
//     type: TypeSplit,
//   ): number {
//     return type === TypeSplit.REPEAT
//       ? amount
//       : Number((amount / quantity).toFixed(2));
//   }
// }
