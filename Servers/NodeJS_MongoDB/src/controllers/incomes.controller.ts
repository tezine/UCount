//region imports
//author bruno@tezine.com
//Arquivo criado com nest g controller ...
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { GlobalsService } from '../services/globals.service';
import { IncomesService } from '../services/incomes.service';
import { EIncome } from '../entities/eincome';
//endregion

@Controller('Incomes')
export class IncomesController {

  //region constructor
  constructor(private globalsService:GlobalsService,private readonly incomesService:IncomesService){
  }
  //endregion

  //region getAll
  @Get('getAll/:userID')
  async getAll(@Param('userID') userID:string,@Query('pageNumber') pageNumber:number=0, @Query('listCount') listCount:number=50, @Query('orderBy') orderBy:Object={dateInserted: 'DESC'}):Promise<EIncome[]>{
    return await this.incomesService.getAll(userID,pageNumber,listCount,orderBy);
  }
  //endregion

  //region getByID
  @Get('getByID/:useID/:id')
  async getByID(@Param('userID') userID:string, @Param('id') id:string ):Promise<EIncome|undefined> {
    return await this.incomesService.getByID(userID,id);
  }
  //endregion

  //region save
  @Post('save')
  async save(@Body() eIncome: EIncome):Promise<string|undefined> {
    return await this.incomesService.save(eIncome);
  }
  //endregion

  //region deleteByID
  @Delete('deleteByID/:userID/:id')
  async deleteByID(@Param('userID') userID:string, @Param('id') id:string): Promise<boolean>{
    return await this.incomesService.deleteByID(userID,id);
  }
  //endregion
}
