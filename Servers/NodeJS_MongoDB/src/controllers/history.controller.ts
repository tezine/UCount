//region imports
//author bruno@tezine.com
/**
 *  Expenses e Incomes poderiam utililzar apenas ETransaction.
 *  Usamos um entity distinto para cada apenas para demonstrar este service acessando 2 outros services (Incomes, Expenses).
 */
import { Controller, Get, Param, Query } from '@nestjs/common';
import { GlobalsService } from '../services/globals.service';
import { HistoryService } from '../services/history.service';
import { Etransaction } from '../entities/etransaction';
//endregion

@Controller('History')
export class HistoryController{

  //region constructor
  constructor(private globalsService:GlobalsService,private readonly historyService:HistoryService){
  }
  //endregion

  //region getAll
  @Get('getAll/:userID')
  async getAll(@Param('userID') userID:string,@Query('pageNumber') pageNumber:number=0, @Query('listCount') listCount:number=50, @Query('orderBy') orderBy:Object={name: 'ASC'}):Promise<Etransaction[]>{
    return await this.historyService.getAll(userID,pageNumber,listCount,orderBy);
  }
  //endregion
}
