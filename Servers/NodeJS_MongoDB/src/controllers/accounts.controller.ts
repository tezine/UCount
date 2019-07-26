//region imports
//author bruno@tezine.com
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { GlobalsService } from '../services/globals.service';
import { AccountsService } from '../services/accounts.service';
import { EAccount } from '../entities/eaccount';
//endregion

@Controller('Accounts')
export class AccountsController {

  //region constructor
  constructor(private globalsService:GlobalsService,private readonly accountsService:AccountsService){
  }
  //endregion

  //region getAll
  @Get('getAll/:userID')
  async getAll(@Param('userID') userID:string,@Query('pageNumber') pageNumber:number=0, @Query('listCount') listCount:number=50, @Query('orderBy') orderBy:Object={name: 'ASC'}):Promise<EAccount[]>{
    return await this.accountsService.getAll(userID,pageNumber,listCount,orderBy);
  }
  //endregion

  //region getByID
  @Get('getByID/:useID/:id')
  async getByID(@Param('userID') userID:string, @Param('id') id:string ):Promise<EAccount|undefined> {
    return await this.accountsService.getByID(userID,id);
  }
  //endregion

  //region save
  @Post('save')
  async save(@Body() eExpense: EAccount):Promise<string|undefined> {
    return await this.accountsService.save(eExpense);
  }
  //endregion

  //region deleteByID
  @Delete('deleteByID/:userID/:id')
  async deleteByID(@Param('userID') userID:string, @Param('id') id:string): Promise<boolean>{
    return await this.accountsService.deleteByID(userID,id);
  }
  //endregion

}
