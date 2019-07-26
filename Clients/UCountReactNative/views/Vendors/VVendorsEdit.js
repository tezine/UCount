//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {observable} from "mobx";
import {ActivityIndicator, Platform, StyleSheet} from "react-native";
import {CGlobals, globalStyles, rest} from '../../codes/CGlobals'
import {Body, Button, Container, Content, Form, Header, Icon, Input, Item, Label, Left, Picker, Right, Title} from "native-base";
import {EVendor} from "../../entities/EVendor";
import { observer, inject } from 'mobx-react/native'
import { Keyboard } from 'react-native'
import ECategory from "../../entities/ECategory";
//endregion

@inject('NavigationStore')
@observer
export default class VVendorsEdit extends React.Component{

    //region fields
    @observable loading=false;
    @observable vendorID=this.props.navigation.getParam('vendorID');
    @observable name='';
    @observable categoryID='';
    @observable description='';
    @observable categoryList:ECategory[]=[];
    //endregion

    async componentWillMount() {
        this.categoryList=await CGlobals.getCategories();
        if(!this.vendorID)return;
        this.loading=true;
        let response = await rest.get('/Vendors/getByID/' + CGlobals.userID+'/'+this.vendorID);
        this.loading=false;
        let eVendor:EVendor = response.body;
        this.name=eVendor.name;
        this.description=eVendor.description;
        this.categoryID=eVendor.categoryID;
        console.log('retornou vendor:',eVendor);
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
                        <Title>Vendor Edit</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={()=>this.btnSaveClicked()}>
                            <Icon name="checkmark" />
                        </Button>
                    </Right>
                </Header>
                <Content >
                    <Form>
                        <Item stackedLabel>
                            <Label>Name</Label>
                            <Input value={this.name} onChangeText={(txt) => this.name=txt}/>
                        </Item>
                        <Item stackedLabel>
                            <Label>Description</Label>
                            <Input value={this.description} onChangeText={(txt) => this.description=txt}/>
                        </Item>
                        <Item stackedLabel>
                            <Label>Category</Label>
                            <Picker style={{ width:(Platform.OS === 'ios') ? undefined : 350 }} mode="dropdown" selectedValue={this.categoryID} onValueChange={this.categoryPickerSelected.bind(this)}>
                                { this.createCategoryPickerList(this.categoryList) }
                            </Picker>
                        </Item>
                    </Form>
                </Content>
                <ActivityIndicator style={globalStyles.loading} size="large" color="#00ff00"  ref={(ref) => { this.spinner = ref; }} animating={this.loading}/>
            </Container>
        )
    }

    createCategoryPickerList(list:ECategory[]){
        let d = list.map((data,i) => {
            return (
                <Picker.Item label={data.name} value={data.id}/>
            )
        });
        if(Platform.OS === 'android'){// no need in ios :P
            d.unshift(<Picker.Item label="Select"/>)
        }
        return d;
    }

    categoryPickerSelected(value: string) {
        this.categoryID=value;
    }

    btnBackClicked(){
        this.props.NavigationStore.navigate({ routeName: CGlobals.VVendors});
    }

    async btnSaveClicked(){
        Keyboard.dismiss();
        let eVendor=new EVendor();
        eVendor.id=this.vendorID;
        eVendor.userID=CGlobals.userID;
        eVendor.name=this.name;
        eVendor.description=this.description;
        eVendor.categoryID=this.categoryID;
        if(!eVendor.name || eVendor.name.length===0)return CGlobals.alert('Error','Set the name');
        let res = await rest.post('/Vendors/save/', {body: eVendor});
        let obj = res.body;
        //console.log('resposta:', obj);
        if(obj)CGlobals.displayToast('Vendor saved','');
        this.btnBackClicked();
    }
}

const styles = StyleSheet.create({
    txtInput: {
        width: 300,
        height: 40,
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
