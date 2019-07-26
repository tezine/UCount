import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('expenses')
export class EExpense {

  @ObjectIdColumn() id?: ObjectID;
  @Column() userID?: string;
  @Column({ length: 100 }) title?: string;
  @Column({ length: 500 }) description?: string;
  @Column() total: number = 0;
  @Column() categoryID?: string;
  @Column() vendorID?:string;
  @Column() dt?: string;
  @Column() dateInserted?: string;
}
