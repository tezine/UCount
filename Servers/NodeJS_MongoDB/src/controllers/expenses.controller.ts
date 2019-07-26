//region imports
//author bruno@tezine.com
//Arquivo criado com nest g controller ...
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { GlobalsService } from '../services/globals.service';
import { ExpensesService } from '../services/expenses.service';
import { EExpense } from '../entities/eexpense';
//endregion

@Controller('Expenses')
export class ExpensesController {

  //region constructor
  constructor(private globalsService:GlobalsService,private readonly expensesService:ExpensesService){
  }
  //endregion

  //region getAll
  @Get('getAll/:userID')
  async getAll(@Param('userID') userID:string,@Query('pageNumber') pageNumber:number=0, @Query('listCount') listCount:number=50, @Query('orderBy') orderBy:Object={dateInserted: 'DESC'}):Promise<EExpense[]>{
    return await this.expensesService.getAll(userID,pageNumber,listCount,orderBy);
  }
  //endregion

  //region getByID
  @Get('getByID/:useID/:id')
  async getByID(@Param('userID') userID:string, @Param('id') id:string ):Promise<EExpense|undefined> {
    return await this.expensesService.getByID(userID,id);
  }
  //endregion

  //region save
  @Post('save')
  async save(@Body() eExpense: EExpense):Promise<string|undefined> {
    return await this.expensesService.save(eExpense);
  }
  //endregion

  //region deleteByID
  @Delete('deleteByID/:userID/:id')
  async deleteByID(@Param('userID') userID:string, @Param('id') id:string): Promise<boolean>{
    return await this.expensesService.deleteByID(userID,id);
  }
  //endregion
}
