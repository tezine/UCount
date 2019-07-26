//region imports
//author bruno@tezine.com
//Criado com nest g service...
import {  Injectable } from '@nestjs/common';
import {  ObjectIdColumn, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EVendor } from '../entities/evendor';
import * as moment from 'moment';
import { MongoClient, ObjectId } from 'mongodb';
//endregion

//query builder do typeorm nao é suportado no mongodb
@Injectable()
export class VendorsService {

  constructor(@InjectRepository(EVendor) private readonly vendorRepository: Repository<EVendor>) {
  }

  async getAll(userID: string, pageNumber: number = 0, listCount: number = 50, orderBy: Object = { name: 'ASC' }): Promise<EVendor[]> {
    //console.log('orderby:',orderBy, '.Skip:',pageNumber*listCount, '.Count:',listCount);
    return await this.vendorRepository.find({
        where:{userID:userID},
        order: orderBy,
        take: Math.floor(listCount),
        skip: pageNumber * listCount
      });
  }

  async getByID(userID: string, id: string): Promise<EVendor | undefined> {
    let eVendor=await this.vendorRepository.findOne(id);
    return eVendor;
  }

  async save(eVendor: EVendor): Promise<string | undefined> {
    if(eVendor==undefined|| (!eVendor.userID))return;
    if(!eVendor.id)eVendor.dateInserted=moment().utc().toISOString();
    else eVendor.id=ObjectId(eVendor.id);
    let e = await this.vendorRepository.save(eVendor);
    if (e.id) return e.id.toHexString();
  }

  async deleteByID(userID: string, id: string): Promise<boolean> {
    let result = await this.vendorRepository.delete({id:ObjectId(id)});
    return true;
  }

  async clear():Promise<void>{
    await this.vendorRepository.clear();
  }
}
