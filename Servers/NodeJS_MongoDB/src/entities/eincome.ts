import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('incomes')
export class EIncome{

  @ObjectIdColumn() id?: ObjectID;
  @Column() userID?: string;
  @Column({ length: 100 }) title?: string;
  @Column({ length: 500 }) description?: string;
  @Column() total: number = 0;
  @Column() categoryID?: string;
  @Column() dt?: string;
  @Column() dateInserted?: string;
}
