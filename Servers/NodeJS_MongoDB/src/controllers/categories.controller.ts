//region imports
//author bruno@tezine.com
//Arquivo criado com nest g controller ...
//Evitar usar ObjectID no controller
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ECategory } from '../entities/ecategory';
import { CategoriesService } from '../services/categories.service';
import { GlobalsService } from '../services/globals.service';
//endregion

@Controller('Categories')
export class CategoriesController {

  //region constructor
  constructor(private globalsService:GlobalsService, private readonly categoriesService:CategoriesService){
  }
  //endregion

  //region getAll
  @Get('getAll/:userID')
  async getAll(@Param('userID') userID:string,@Query('pageNumber') pageNumber:number=0, @Query('listCount') listCount:number=50, @Query('orderBy') orderBy:Object={name: 'ASC'}):Promise<ECategory[]>{
    return await this.categoriesService.getAll(userID,pageNumber,listCount,orderBy);
  }
  //endregion

  //region getByID
  @Get('getByID/:useID/:id')
  async getByID(@Param('userID') userID:string, @Param('id') id:string ):Promise<ECategory|undefined> {
    return await this.categoriesService.getByID(userID,id);
  }
  //endregion

  //region save
  @Post('save')
  async save(@Body() eCategory: ECategory):Promise<string|undefined> {
    return await this.categoriesService.save(eCategory);
  }
  //endregion

  //region deleteByID
  @Delete('deleteByID/:userID/:id')
  async deleteByID(@Param('userID') userID:string, @Param('id') id:string): Promise<boolean>{
    return await this.categoriesService.deleteByID(userID,id);
  }
  //endregion
}
