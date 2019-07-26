import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('accounts')
export class EAccount{

  @ObjectIdColumn() _id?: ObjectID;
  @Column({ length: 200 }) name: string = '';
  @Column({ length: 500 }) description: string = '';
  @Column() userID?: string;
}
