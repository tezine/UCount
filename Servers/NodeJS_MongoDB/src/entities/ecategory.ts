import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import {Transform} from 'class-transformer';

@Entity('categories')
export class ECategory {

  @ObjectIdColumn() id?: ObjectID;
  //@ObjectIdColumn() _id?: ObjectID;
  //@Transform((x: ObjectID) => x.toHexString(), {toPlainOnly: true})
  // @PrimaryGeneratedColumn() id?: number;
  @Column({ length: 100 }) name: string = '';
  @Column() userID?: string;
  @Column({ length: 500 }) description: string = '';
  @Column() iconName?:string;
  @Column() dateInserted?: string;
}
