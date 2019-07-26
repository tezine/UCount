//region imports
//author bruno@tezine.com
//Criado com nest g service...
import {  Delete, Injectable} from '@nestjs/common';
import {  ObjectIdColumn, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EAccount } from '../entities/eaccount';
//endregion

@Injectable()
export class AccountsService {

  constructor(@InjectRepository(EAccount) private readonly accountRepository: Repository<EAccount>) {
  }

  async getAll(userID:string,pageNumber: number = 0, listCount: number = 50, orderBy: Object = { name: 'ASC' }):Promise<EAccount[]>{
    return await this.accountRepository.find({
      where:{userID:userID},
      order: orderBy,
      take: Math.floor(listCount),
      skip: pageNumber * listCount
    });
  }

  async getByID(userID:string, id:string):Promise<EAccount|undefined> {
    return await this.accountRepository.findOne({_id:ObjectIdColumn(id)});
  }

  async save(eAccount: EAccount):Promise<string|undefined> {
    let e=await this.accountRepository.save(eAccount);
    if(e._id)return e._id.toHexString();
  }

  async deleteByID(userID:string, id:string): Promise<boolean>{
    let result= await this.accountRepository.delete({_id:ObjectIdColumn(id)});
    return true;
  }

  async clear():Promise<void>{
    await this.accountRepository.clear();
  }
}
