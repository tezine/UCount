import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('users')
export class EUser{

  @ObjectIdColumn() id?: ObjectID;
  @Column({ length: 200 }) name: string = '';
  @Column({ length: 200 }) email: string = '';
  @Column({ length: 50 }) password: string = '';
  @Column() enabled: boolean = true;
  @Column() dateInserted?: string;
}
