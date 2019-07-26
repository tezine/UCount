//region imports
//author bruno@tezine.com
//Criado com nest g service...
import {Delete, Get, Injectable, Param} from '@nestjs/common';
import {ObjectIdColumn, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {EUser} from '../entities/euser';
import * as moment from 'moment';
import {MongoClient, ObjectId} from 'mongodb';

//endregion

@Injectable()
export class UsersService {

    constructor(@InjectRepository(EUser) private readonly userRepository: Repository<EUser>) {
    }

    async getAll(pageNumber: number = 0, listCount: number = 50, orderBy: Object = {name: 'ASC'}): Promise<EUser[]> {
        let list= await this.userRepository.find({
            order: orderBy,
            take: Math.floor(listCount),
            skip: pageNumber * listCount
        });
        return list;
    }

    async authenticate(email: string, password: string): Promise<EUser | null> {
        //console.log('(UsersService)autenticando:',email,'.Senha:'+password);
        let eUser = await this.userRepository.findOne({email: email.toLowerCase(), password: password, enabled: true});
        //console.log("(authenticate)",eUser);
        if (eUser) {
            eUser.password = '';
            return eUser;
        }
        else return null;
    }

    async getByID(id: string): Promise<EUser | undefined> {
        return await this.userRepository.findOne(id);
    }

    async save(eUser: EUser): Promise<string | undefined> {
        if (!eUser.id) eUser.dateInserted = moment().utc().toISOString();
        let e = await this.userRepository.save(eUser);
        if (e.id) return e.id.toHexString();
    }

    async create(eUser: EUser): Promise<string | undefined> {
        eUser.email=eUser.email.toLowerCase();
        if(await this.userRepository.findOne({email:eUser.email}))return 'email exists';
        if (!eUser.id) eUser.dateInserted = moment().utc().toISOString();
        let savedUser = await this.userRepository.save(eUser);
        if (savedUser.id) return savedUser.id.toHexString();
    }

    async deleteByID(id: string): Promise<boolean> {
        let result = await this.userRepository.delete({id: ObjectId(id)});
        return true;
    }

    async clear(): Promise<void> {
        await this.userRepository.clear();
    }
}
