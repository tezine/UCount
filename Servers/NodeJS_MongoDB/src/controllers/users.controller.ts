//region imports
//author bruno@tezine.com
import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';
import {GlobalsService} from '../services/globals.service';
import {EUser} from '../entities/euser';
import {UsersService} from '../services/users.service';

//endregion

@Controller('Users')
export class UsersController {

    //region constructor
    constructor(private globalsService: GlobalsService, private readonly usersService: UsersService) {
    }
    //endregion

    //region getAll
    @Get('getAll')
    async getAll(@Query('pageNumber') pageNumber: number = 0, @Query('listCount') listCount: number = 50, @Query('orderBy') orderBy: Object = {name: 'ASC'}): Promise<EUser[]> {
        return await this.usersService.getAll(pageNumber, listCount, orderBy);
    }
    //endregion

    //region authenticate
    @Get('authenticate/:email/:password')
    async authenticate(@Param('email') email: string, @Param('password') password: string): Promise<EUser | null> {
        return await this.usersService.authenticate(email, password);
    }
    //endregion

    //region getByID
    @Get('getByID/:id')
    async getByID(@Param('id') id: string): Promise<EUser | undefined> {
        return await this.usersService.getByID(id);
    }
    //endregion

    //region save
    @Post('save')
    async save(@Body() eUser: EUser): Promise<string | undefined> {
        return await this.usersService.save(eUser);
    }
    //endregion

    //region create
    @Post('create')
    async create(@Body() eUser: EUser): Promise<string | undefined> {
        return await this.usersService.create(eUser);
    }
    //endregion

    //region deleteByID
    @Delete('deleteByID/:id')
    async deleteByID(@Param('id') id: string): Promise<boolean> {
        return await this.usersService.deleteByID(id);
    }
    //endregion
}
