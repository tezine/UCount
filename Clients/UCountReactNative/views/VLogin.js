//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {ImageBackground, StyleSheet, Text, TextInput, TouchableHighlight, View} from "react-native";
import {CGlobals, rest} from '../codes/CGlobals'
import {Toast} from "native-base";
import {action, computed, observable} from "mobx";
import {observer, inject} from 'mobx-react/native'
import { AsyncStorage } from 'react-native';
const backImage = require("../assets/images/drawer-cover.png");
//endregion

@inject('NavigationStore')
@observer
export default class VLogin extends React.Component {
    //region fields
    static navigationOptions = {title: 'UCount'};
    @observable email = "";
    @observable password = "";
    //endregion

    constructor(props) {
        super(props);
    }

    async componentWillMount(){
        const email = await AsyncStorage.getItem('email');
        const password= await AsyncStorage.getItem('password');
        if(email!=null)this.email=email;
        if(password!=null)this.password=password;
    }

    render() {
        return (
            <ImageBackground source={backImage} style={styles.container}>
                <Text style={styles.loginTitle}>
                    UCount
                </Text>
                <TextInput value={this.email} placeholder={'e-mail'} style={styles.txtInput} onChangeText={(email) => this.email = email} placeholderTextColor='white' underlineColorAndroid='white'/>
                <TextInput value={this.password} placeholder={'password'} style={styles.txtInput} onChangeText={(password) => this.password = password} placeholderTextColor='white' secureTextEntry={true} underlineColorAndroid='white'/>
                <TouchableHighlight onPress={() => this.btnEntrarClicked()} underlayColor="transparent">
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>LOGIN</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.btnNewUserClicked()} underlayColor="transparent" style={styles.buttonNewUser}>
                        <Text style={{color: 'yellow', textAlign:'right'}} >new user</Text>
                </TouchableHighlight>
            </ImageBackground>
        );
    }

    async btnEntrarClicked() {
        if(this.email.length<3) return Toast.show({text: 'Type the email', duration: 4000, buttonText: '', type: 'danger'});
        if(this.password.length<3) return Toast.show({text: 'Type the password', duration: 4000, buttonText: '', type: 'danger'});
        await AsyncStorage.setItem('email', this.email);
        await AsyncStorage.setItem('password', this.password);
        //console.log('vai autenticar ', this.email, this.password);
        let res = await rest.get('/Users/authenticate/' + this.email.toLowerCase().trim() + "/" + this.password.toLowerCase().trim());
        let eUser = res.body;
        //console.log('resposta:', eUser);
        if (eUser && eUser.id !== undefined) {
            CGlobals.userID = eUser.id;
            this.props.NavigationStore.navigate({routeName: CGlobals.VExpenses});
        }
        else Toast.show({text: 'Wrong credentials', duration: 4500, buttonText: '', type: 'danger'})
    }

    async btnNewUserClicked(){
        this.props.NavigationStore.navigate({routeName: CGlobals.VNewUser});
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#263238',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    },
    loginTitle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 50
    },
    txtInput: {
        width: 300,
        height: 40,
        color: 'white'
    },
    button: {
        // marginBottom: 30,
        width: 300,
        alignItems: 'center',
        backgroundColor: '#2196F3'
    },
    buttonText: {
        padding: 20,
        color: 'white'
    },
    buttonNewUser:{
        width:300,
        // backgroundColor:'gray',
        height:70,
        justifyContent: 'center',
        alignItems: 'flex-end'
    }
});
