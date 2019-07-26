import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('vendors')
export class EVendor{

  @ObjectIdColumn() id?: ObjectID;
  @Column() userID?: string;
  @Column() categoryID?: string;
  @Column({ length: 200 }) name: string = '';
  @Column() dateInserted?: string;
}
