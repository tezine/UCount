//region imports
//@author  bruno@tezine.com
import React from "react";
import {Body, Button, Container, Content, Footer, FooterTab, Form, Header, Icon, Input, Item, Label, Left, List, ListItem, Right, Text, Title, Toast, View} from "native-base";
import {CGlobals, globalStyles, rest} from "../codes/CGlobals";
import {action, computed, observable} from "mobx";
import {observer, inject} from 'mobx-react/native'
import {ImageBackground, Keyboard, StyleSheet, TextInput, TouchableHighlight} from "react-native";
import {EUser} from "../entities/EUser";
const backImage = require("../assets/images/drawer-cover.png");
//endregion

@inject('NavigationStore')
@observer
export default class VNewUser extends React.Component {

    //region fields
    @observable name = '';
    @observable email = '';
    @observable password = '';
    @observable repeatPassword = '';

    //endregion

    render() {
        return (
            <Container style={globalStyles.container}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.btnBackClicked()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>New User</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content contentContainerStyle={{flex:1,backgroundColor:'gray'}}>
                    <ImageBackground source={backImage} style={styles.container}>
                    <TextInput placeholder={'name'} style={styles.txtInput} onChangeText={(txt) => this.name = txt} placeholderTextColor='white' underlineColorAndroid='white'/>
                    <TextInput placeholder={'e-mail'} style={styles.txtInput} onChangeText={(email) => this.email = email} placeholderTextColor='white' underlineColorAndroid='white'/>
                    <TextInput placeholder={'password'} style={styles.txtInput} onChangeText={(password) => this.password = password} placeholderTextColor='white' secureTextEntry={true} underlineColorAndroid='white'/>
                    <TextInput placeholder={'repeat password'} style={styles.txtInput} onChangeText={(txt) => this.repeatPassword = txt} placeholderTextColor='white' secureTextEntry={true} underlineColorAndroid='white'/>
                        <TouchableHighlight onPress={() => this.btnCreateClicked()} underlayColor="transparent">
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>CREATE</Text>
                            </View>
                        </TouchableHighlight>
                    </ImageBackground>
                </Content>
            </Container>
        )
    }

    btnBackClicked() {
        Keyboard.dismiss();
        this.props.NavigationStore.navigate({routeName: CGlobals.VLogin})
    }

    async btnCreateClicked() {
        Keyboard.dismiss();
        if (this.password.length < 1) return  Toast.show({text: 'Invalid password', duration:4000, type:'danger'});
        if (this.password !== this.repeatPassword) return Toast.show({text: 'Passwords do not match', duration:4000, type:'danger'});
        console.log('vai criar user ', this.email);
        let eUser = new EUser();
        eUser.name = this.name;
        eUser.email = this.email.toLowerCase().trim();
        eUser.password = this.password.toLowerCase().trim();
        eUser.enabled = true;
        let res = await rest.post('/Users/create/', {body: eUser});
        let obj = res.body;
        if(typeof obj === "string" && (obj==='email exists'))return Toast.show({text: 'Email exists', duration:4000, type:'danger'});
        console.log('setando userID:',obj);
        CGlobals.userID=obj;
        this.props.NavigationStore.navigate({routeName: CGlobals.VExpenses});
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
    txtInput: {
        width: 300,
        height: 40,
        color: 'white'
    },
    button: {
        marginBottom: 30,
        width: 300,
        alignItems: 'center',
        backgroundColor: '#2196F3'
    },
    buttonText: {
        padding: 20,
        color: 'white'
    }
});
