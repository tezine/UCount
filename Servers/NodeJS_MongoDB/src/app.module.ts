//region imports
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExpensesController } from './controllers/expenses.controller';
import { IncomesController } from './controllers/incomes.controller';
import { CategoriesController } from './controllers/categories.controller';
import { VendorsController } from './controllers/vendors.controller';
import { UsersController } from './controllers/users.controller';
import { CategoriesService } from './services/categories.service';
import { AccountsController } from './controllers/accounts.controller';
import { GlobalsService } from './services/globals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ECategory } from './entities/ecategory';
import { ExpensesService } from './services/expenses.service';
import { EExpense } from './entities/eexpense';
import { EUser } from './entities/euser';
import { UsersService } from './services/users.service';
import { EVendor } from './entities/evendor';
import { VendorsService } from './services/vendors.service';
import { EAccount } from './entities/eaccount';
import { EIncome } from './entities/eincome';
import { AccountsService } from './services/accounts.service';
import { IncomesService } from './services/incomes.service';
import { Etransaction } from './entities/etransaction';
import { HistoryController } from './controllers/history.controller';
import { HistoryService } from './services/history.service';
//endregion

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature(//é necessário adicionar cada entity usado no mongo aqui
      [ECategory,
                  EExpense,
                  EUser,
                  EVendor,
                  EAccount,
                  EIncome,
      ]
    ),
  ],
  controllers: [
    AppController,
    ExpensesController,
    IncomesController,
    CategoriesController,
    VendorsController,
    UsersController,
    AccountsController,
    HistoryController
  ],
  providers: [
    AppService,
    CategoriesService,
    ExpensesService,
    UsersService,
    VendorsService,
    AccountsService,
    IncomesService,
    HistoryService,
    GlobalsService,
  ],
})
export class AppModule {

}
