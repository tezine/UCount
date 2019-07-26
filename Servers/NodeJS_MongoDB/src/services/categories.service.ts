//region imports
//author bruno@tezine.com
//Criado com nest g service...
import { Delete, Injectable } from '@nestjs/common';
import { ECategory } from '../entities/ecategory';
import { ObjectID, ObjectIdColumn, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { MongoClient, ObjectId } from 'mongodb';
//endregion

@Injectable()
export class CategoriesService {

  constructor(@InjectRepository(ECategory) private readonly categoryRepository: Repository<ECategory>) {
  }

  async getAll(userID:string,pageNumber: number = 0, listCount: number = 50, orderBy: Object = { name: 'ASC' }):Promise<ECategory[]>{
    return await this.categoryRepository.find({
      where:{userID:userID},
      order: orderBy,
      take: Math.floor(listCount),
      skip: pageNumber * listCount
    });
  }

  async getByID(userID:string, id:string):Promise<ECategory|undefined> {
    return await this.categoryRepository.findOne(id);
  }

  async save(eCategory: ECategory):Promise<string|undefined> {
    if(eCategory==undefined|| (!eCategory.userID))return;
    if(!eCategory.id)eCategory.dateInserted=moment().utc().toISOString();
    else {//todo ver pq nao salva direto passando o id em hex
      // let oldObj= await this.categoryRepository.findOne(eCategory.id);
      // if(oldObj)eCategory.id=oldObj.id;
      eCategory.id=ObjectId(eCategory.id);
    }
    let e=await this.categoryRepository.save(eCategory);
    if(e.id)return e.id.toHexString();
  }

  async deleteByID(userID:string, id:string): Promise<boolean>{
    //let result= await this.categoryRepository.delete({id:ObjectIdColumn(id)});
    //todo ObjectID.fromHex nao funciona nao sei pq!
    let result= await this.categoryRepository.delete({id:ObjectId(id)});
    return true;
  }

  async clear():Promise<void>{
    await this.categoryRepository.clear();
  }
}
