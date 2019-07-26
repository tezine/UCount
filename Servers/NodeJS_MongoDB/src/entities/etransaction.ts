import { TransactionType } from '../enums/transactiontype';

export class Etransaction {

  _id?: string;
  userID?: string;
  title?: string;
  description?: string;
  total: number = 0;
  categoryID?: string;

  type?:TransactionType;
}
