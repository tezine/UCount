//region imports
import React from 'react';
import VIncomesEdit from "../views/Incomes/VIncomesEdit";
import NavigationStore, {DrawerNavigator, StackNavigator} from "mobx-react-navigation-store";
import VDashboard from "../views/VDashboard";
import VConfig from "../views/Config/VConfig";
import VHistory from "../views/VHistory";
import VExpensesEdit from "../views/Expenses/VExpensesEdit";
import VCategories from "../views/Categories/VCategories";
import VReports from "../views/VReports";
import VCategoriesEdit from "../views/Categories/VCategoriesEdit";
import VLogin from "../views/VLogin";
import VIncomes from "../views/Incomes/VIncomes";
import {create} from "mobx-persist/lib/index";
import VExpenses from "../views/Expenses/VExpenses";
import VVendors from "../views/Vendors/VVendors";
import VVendorsEdit from "../views/Vendors/VVendorsEdit";
import {AsyncStorage} from "react-native";
import VSideBar from "../components/VSideBar";
import VConfigAbout from "../views/Config/VConfigAbout";
import VConfigHelp from "../views/Config/VConfigHelp";
import VConfigProfile from "../views/Config/VConfigProfile";
import VNewUser from "../views/VNewUser";
//endregion


let FirstView='VLogin';

export const UCountNavigator = DrawerNavigator('MainDrawer', {
        VLogin: {screen: VLogin,     navigationOptions: {drawerLockMode: 'locked-closed'}},
        VNewUser: {screen: VNewUser, navigationOptions: {drawerLockMode: 'locked-closed'}},
        VDashboard: {screen: VDashboard},
        VHistory: {screen: VHistory},
        VExpenses: {screen: VExpenses},
        VExpensesEdit: {screen: VExpensesEdit},
        VIncomes: {screen: VIncomes},
        VIncomesEdit: {screen: VIncomesEdit},
        VReports: {screen: VReports},
        VCategories: {screen: VCategories},
        VCategoriesEdit: {screen: VCategoriesEdit},
        VVendors: {screen: VVendors},
        VVendorsEdit: {screen: VVendorsEdit},
        VConfig: {screen: VConfig},
        VConfigProfile: {screen: VConfigProfile},
        VConfigAbout: {screen: VConfigAbout},
        VConfigHelp: {screen: VConfigHelp}
    },
    {
        initialRouteName: FirstView,
        contentOptions: {
            activeTintColor: "#e91e63",
        },
        contentComponent: props => <VSideBar {...props} />
    }
);

//==============================STORE CONFIGURATION BELOW===============

export const hydrate = create({
    storage: AsyncStorage //this is since I'm using react native
});

export const stores = {NavigationStore};

export let hydrated = false;
export const result = hydrate('Nav', NavigationStore).then(() => {
    NavigationStore.setNavigators({
        MainDrawer: {
            type: 'drawer',
            // nested: { NestedNavigatorTabs: 'MainTabs' },
            parent: null,
            shouldPersist: false,
            initRoute: FirstView
        },
    }, {
        initialNavigatorName: 'MainDrawer',
        order: ['MainDrawer']
    });
    setTimeout(() => NavigationStore.doneHydrating(), 1000);
    NavigationStore.StartedStoreHydration()
}).catch(error => console.log("aconteceu um erro", error));