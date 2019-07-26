//region imports
import Frisbee from "frisbee";
import {Alert, StyleSheet} from 'react-native'
import {  Toast } from 'native-base';
import ECategory from "../entities/ECategory";
import {EVendor} from "../entities/EVendor";
//endregion


export class CGlobals{
   // static readonly ViewDashboard='ViewDashboard';
    static userID:string="5b0579c83c81f51968cc03df";
    static listCount:number=50;
    static brDateFormat='DD/MM/YYYY';
    static drawerLockMode='locked-closed';

    static DrawerOpen='DrawerOpen';
    static VIncomes='VIncomes';
    static VIncomeEdit='VIncomesEdit';
    static VExpenses='VExpenses';
    static VExpensesEdit='VExpensesEdit';
    static VCategories='VCategories';
    static VCategoriesEdit='VCategoriesEdit';
    static VVendors='VVendors';
    static VVendorsEdit='VVendorsEdit';
    static VConfig='VConfig';
    static VLogin='VLogin';
    static VNewUser='VNewUser';
    static VConfigHelp='VConfigHelp';
    static VConfigProfile='VConfigProfile';
    static VConfigAbout='VConfigAbout';
    static VAccounts='VAccounts';

    static displayToast(txt:string, btnText:string):void{
         Toast.show({text: txt, duration:4500, buttonText: btnText})
    }

    static alert(title:string, msg:string):void{
        Alert.alert(title,msg);
    }

    static async getCategories():Promise<ECategory[]>{//let's get all user's categories
        let catResponse = await rest.get('/Categories/getAll/' + CGlobals.userID,{
            body: {
                orderBy:{name:'ASC'}
            }
        });
        let categories:ECategory[] = catResponse.body;
        //console.log('retornando categorias:',categories);
        return categories;
    }

    static async getVendors():Promise<EVendor[]>{
        let response = await rest.get('/Vendors/getAll/' + CGlobals.userID, {
            body: {
                orderBy: {name: 'ASC'}
            }
        });
        let vendors:EVendor[]=response.body;
        return vendors;
    }

    static async getVendor(id):Promise<EVendor>{
        let response=await rest.get('/Vendors/getByID/' + CGlobals.userID+'/'+id);
        let eVendor:EVendor =  response.body;
        return eVendor;
    }
}


export const rest = new Frisbee({
    baseURI: 'http://172.23.178.214:3000/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export const globalStyles=StyleSheet.create({
    container: {
        backgroundColor: "#fff"
    },
    txtHeader:{
        padding:10
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
});