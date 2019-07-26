//region imports
//author bruno@tezine.com
//Criado com nest g service...
import { Delete, Injectable } from '@nestjs/common';
import {  ObjectIdColumn, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EIncome } from '../entities/eincome';
import * as moment from 'moment';
import { MongoClient, ObjectId } from 'mongodb';
//endregion

@Injectable()
export class IncomesService {

  constructor(@InjectRepository(EIncome) private readonly incomeRepository: Repository<EIncome>) {
  }

  async getAll(userID:string,pageNumber:number=0, listCount:number=50, orderBy:Object={dt: 'DESC'}):Promise<EIncome[]>{
    return await this.incomeRepository.find({
      where:{userID:userID},
      order: orderBy,
      take:Math.floor(listCount),
      skip:pageNumber*listCount
    });
  }

  async getByID(userID:string, id:string):Promise<EIncome|undefined> {
    return await this.incomeRepository.findOne(id);
  }

  async save(eIncome: EIncome):Promise<string|undefined> {
    if(!eIncome.id)eIncome.dateInserted=moment().utc().toISOString();
    else eIncome.id=ObjectId(eIncome.id);
    let e=await this.incomeRepository.save(eIncome);
    if(e.id)return e.id.toHexString();
  }

  async deleteByID(userID: string, id:string): Promise<boolean>{
    let result= await this.incomeRepository.delete({id:ObjectId(id)});
    return true;
  }

  async clear():Promise<void>{
    await this.incomeRepository.clear();
  }
}
