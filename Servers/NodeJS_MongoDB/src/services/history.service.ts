//region imports
//author bruno@tezine.com
/**
 *  Expenses e Incomes poderiam utililzar apenas ETransaction.
 *  Usamos um entity distinto para cada apenas para demonstrar este service acessando 2 outros services (Incomes, Expenses).
 */
import { Injectable } from '@nestjs/common';
import { Etransaction } from '../entities/etransaction';
import { ExpensesService } from './expenses.service';
import { IncomesService } from './incomes.service';
//endregion

@Injectable()
export class HistoryService {

  constructor(private expensesService: ExpensesService, private incomesService: IncomesService) {
  }

  async getAll(userID: string,pageNumber:number=0, listCount:number=50, orderBy:Object={dateInserted: 'DESC'}): Promise<Etransaction[]> {
    let transactionsList: Etransaction[] = [];
    let expensesList = await this.expensesService.getAll(userID);
    let incomesList = await this.incomesService.getAll(userID);
    for (let eExpense of expensesList) {
      let eTransaction = new Etransaction();
      eTransaction.title = eExpense.title;
      transactionsList.push(eTransaction);
    }

    for (let eIncome of incomesList) {
      let eTransaction = new Etransaction();
      eTransaction.title = eIncome.title;
      transactionsList.push(eTransaction);
    }
    return transactionsList;
  }
}
