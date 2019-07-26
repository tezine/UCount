//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {observable} from "mobx";
import {ActivityIndicator, Keyboard, StyleSheet} from "react-native";
import {CGlobals, globalStyles, rest} from '../../codes/CGlobals'
import {Body, Button, Card, CardItem, Container, Content, Form, Header, Icon, Input, Item, Label, Left, List, ListItem, Right, Switch, Text, Title} from "native-base";
import {EUser} from "../../entities/EUser";
import { observer, inject } from 'mobx-react/native'
//endregion

@inject('NavigationStore')
@observer
export default class VConfigProfile extends React.Component{

    //region fields
    @observable name='';
    @observable email='';
    @observable password='';
    @observable repeatPassword='';
    @observable loading=false;
    //endregion

    constructor() {
        super();
    }

    async componentWillMount() {
        this.loading=true;
        let response = await rest.get('/Users/getByID/' + CGlobals.userID);
        this.loading=false;
        //console.log("response:",response.body);
        let eUser:EUser = response.body;
        this.name=eUser.name;
        this.email=eUser.email;
    }

    render(){
        return(
            <Container  style={globalStyles.container}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.btnBackClicked()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Profile</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={()=>this.btnSaveClicked()}>
                            <Icon name="checkmark" />
                        </Button>
                    </Right>
                </Header>
                <Content padder>
                    <Form>
                        <Item stackedLabel>
                            <Label>Name</Label>
                            <Input value={this.name} onChangeText={(txt) => this.name=txt}/>
                        </Item>
                        <Item stackedLabel>
                            <Label>E-mail</Label>
                            <Input value={this.email} onChangeText={(txt) => this.email=txt}/>
                        </Item>
                        <Item stackedLabel>
                            <Label>Password</Label>
                            <Input onChangeText={(txt) => this.password=txt} secureTextEntry={true}/>
                        </Item>
                        <Item stackedLabel>
                            <Label>Repeat password</Label>
                            <Input onChangeText={(txt) => this.repeatPassword=txt} secureTextEntry={true}/>
                        </Item>
                        {/*<Item style={styles.switchItem}>*/}
                            {/*<Switch value={false} />*/}
                            {/*<Label>Request password</Label>*/}
                        {/*</Item>*/}
                    </Form>
                </Content>
                <ActivityIndicator style={globalStyles.loading} size="large" color="#00ff00"  ref={(ref) => { this.spinner = ref; }} animating={this.loading}/>
            </Container>
        )
    }

    btnBackClicked(){
        Keyboard.dismiss();
        this.props.NavigationStore.navigate({ routeName: CGlobals.VConfig })
    }

    async btnSaveClicked(){
        Keyboard.dismiss();
        if(this.password.length<1)return CGlobals.alert('Error','Invalid password');
        if(this.password!==this.repeatPassword)return CGlobals.alert('Error','Passwords do not match');
        console.log('vai salvar config ',this.name, this.description);
        let eUser=new EUser();
        eUser.userID=CGlobals.userID;
        eUser.name=this.name;
        eUser.email=this.email;
        eUser.password=this.password;
        eUser.enabled=true;
        let res = await rest.post('/Users/save/', {body: eUser});
        let obj = res.body;
        console.log('resposta:', obj);
        if(obj)CGlobals.displayToast('Profile saved','');
        this.btnBackClicked();
    }
}

const styles = StyleSheet.create({
    txtInput: {
        width: 300,
        height: 40,
    },
    switchItem:{
        flex:1,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height:70
    },
    card:{
        width:300,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'yellow'
    },
    cardItem:{
        backgroundColor:'blue'
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionNaousada:{
        paddingLeft: 20,
        lineHeight:45
    },
});
