//region imports
import React from 'react';
import {Root, View} from "native-base";
import NavigationStore from 'mobx-react-navigation-store';
import {inject, observer, Provider} from 'mobx-react/native'
import {stores, UCountNavigator} from "./codes/CRoutes";
import {setJSExceptionHandler} from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';
import {Alert, BackHandler } from 'react-native';
//endregion

const errorHandler = (e, isFatal) => {
    if (isFatal) {
        Alert.alert('Unexpected error occurred', `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
        We will need to restart the app.
        `,
            [{
                text: 'Restart',
                onPress: () => {
                    RNRestart.Restart();
                }
            }]
        );
    } else {
        console.log("(errorHandler)-->",e); // So that we can see it in the ADB logs in case of Android if needed
    }
};

setJSExceptionHandler(errorHandler,false/*allowedInDevMode*/);



@observer
export default class App extends React.Component {

    state = {fontLoaded: false};

    constructor(props) {
        super(props);
        this.state = {}
    }

     async componentDidMount() {
    //     // await Expo.Font.loadAsync({
    //     //     'Roboto': require('./assets/fonts/Roboto.ttf'),
    //     //     'Roboto_medium': require('./assets/fonts/Roboto_medium.ttf'),
    //     // });
    //     // console.log('(App.componentDidMount)carregou fonte');
    //     // this.setState({fontLoaded: true});
         BackHandler.addEventListener('hardwareBackPress', function() {
             console.log('clicou em back',stores.NavigationStore.canGoBack, stores.NavigationStore.CurrentRoute);
             //aparentemente stores.NavigationStore.canGoBack sempre retorna false
             if(stores.NavigationStore.CurrentRoute!=='VLogin'){
                 console.log('pode voltar');
                 stores.NavigationStore.goBack();
                 return true;
             }else{
                 let result=false;
                 Alert.alert('Confirmation', 'Exit Ucount?',
                     [
                         {text: 'Cancel', onPress: () => result=true, style: 'cancel'},
                         {text: 'OK', onPress: () => result=false},//retorna false para fechar o app
                     ], { cancelable: true }
                 );
                 return result;
             }
         });
     }

    render() {
        return (
            <Root>
                <View style={{flex: 1, justifyContent: 'space-around'}}>
                    {NavigationStore.startedStoreHydration && <Provider {...stores}>
                        <UCountNavigator/>
                    </Provider>}
                </View>
            </Root>
        );
    }
}