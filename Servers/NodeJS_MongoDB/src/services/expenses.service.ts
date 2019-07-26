//region imports
//author bruno@tezine.com
//Criado com nest g service...
import {Delete, Injectable} from '@nestjs/common';
import {ObjectIdColumn, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {EExpense} from '../entities/eexpense';
import * as moment from 'moment';
import {MongoClient, ObjectId} from 'mongodb';

//endregion

@Injectable()
export class ExpensesService {

    constructor(@InjectRepository(EExpense) private readonly expenseRepository: Repository<EExpense>) {
    }

    async getAll(userID: string, pageNumber: number = 0, listCount: number = 50, orderBy: Object = {dt: 'DESC'}): Promise<EExpense[]> {
        let list = await this.expenseRepository.find({
            where: {userID: userID},
            order: orderBy,
            take: Math.floor(listCount),
            skip: pageNumber * listCount
        });
        if (list !== undefined) return list;
        else return [];
    }

    async getByID(userID: string, id: string): Promise<EExpense | undefined> {
        return await this.expenseRepository.findOne(id);
    }

    async save(eExpense: EExpense): Promise<string | undefined> {
        if (!eExpense.id) eExpense.dateInserted = moment().utc().toISOString();
        else eExpense.id = ObjectId(eExpense.id);
        let e = await this.expenseRepository.save(eExpense);
        if (e.id) return e.id.toHexString();
    }

    async deleteByID(userID: string, id: string): Promise<boolean> {
        let result = await this.expenseRepository.delete({id: ObjectId(id)});
        return true;
    }

    async clear(): Promise<void> {
        await this.expenseRepository.clear();
    }
}
