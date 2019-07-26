//region imports
//author bruno@tezine.com
//Arquivo criado com nest g controller ...
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { GlobalsService } from '../services/globals.service';
import { VendorsService } from '../services/vendors.service';
import { EVendor } from '../entities/evendor';
//endregion

@Controller('Vendors')
export class VendorsController {

  //region constructor
  constructor(private globalsService:GlobalsService, private readonly vendorsService:VendorsService){
  }
  //endregion

  //region getAll
  @Get('getAll/:userID')
  async getAll(@Param('userID') userID:string, @Query('pageNumber') pageNumber:number=0, @Query('listCount') listCount:number=50, @Query('orderBy') orderBy:Object={name: 'ASC'}):Promise<EVendor[]>{
    return await this.vendorsService.getAll(userID,pageNumber,listCount,orderBy);
  }
  //endregion

  //region getByID
  @Get('getByID/:useID/:id')
  async getByID(@Param('userID') userID:string, @Param('id') id:string ):Promise<EVendor|undefined> {
    return await this.vendorsService.getByID(userID,id);
  }
  //endregion

  //region save
  @Post('save')
  async save(@Body() eVendor: EVendor):Promise<string|undefined> {
    return await this.vendorsService.save(eVendor);
  }
  //endregion

  //region deleteByID
  @Delete('deleteByID/:userID/:id')
  async deleteByID(@Param('userID') userID:string, @Param('id') id:string): Promise<boolean>{
    return await this.vendorsService.deleteByID(userID,id);
  }
  //endregion
}
