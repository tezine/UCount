//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {Body, Button, Container, Content, Form, Header, Icon, Input, InputGroup, Item, Label, Left, Picker, Right, Text, Title, View} from "native-base";
import {CGlobals, globalStyles} from "../../codes/CGlobals";
import {ActivityIndicator, Keyboard, Platform, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import {observable} from "mobx";
import { observer, inject } from 'mobx-react/native'
import {rest} from '../../codes/CGlobals'
import EExpense from "../../entities/EExpense";
import ECategory from "../../entities/ECategory";
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from "moment/moment";
import {EVendor} from "../../entities/EVendor";
//endregion

@inject('NavigationStore')
@observer
export default class VExpensesEdit extends React.Component{

    //region fields
    @observable loading=false;
    @observable expenseID=this.props.navigation.getParam('expenseID');
    @observable title='';
    @observable description='';
    @observable total;
    @observable dt=new Date();
    @observable isDateTimePickerVisible:boolean=false;
    @observable selectedCategoryID= undefined;
    @observable selectedVendorID=undefined;
    @observable categoryList:ECategory[]=[];
    @observable vendorList:EVendor[]=[];
    //endregion

    constructor(props){
        super(props);
    }

    async componentWillMount() {
        this.categoryList=await CGlobals.getCategories();
        this.vendorList=await CGlobals.getVendors();
        console.log('vai mostrar data:',moment(this.dt).format(CGlobals.brDateFormat), this.expenseID);
        if(!this.expenseID)return;
        this.loading=true;
        let response = await rest.get('/Expenses/getByID/' + CGlobals.userID+'/'+this.expenseID);
        //this.loading=false;
        let eExpense:EExpense = response.body;
        this.title=eExpense.title;
        this.description=eExpense.description;
        this.selectedVendorID=eExpense.vendorID;
        this.total=eExpense.total.toString();
        this.dt=new Date(eExpense.dt);
        this.selectedCategoryID=eExpense.categoryID;
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
                        <Title>Expenses Edit</Title>
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
                            <Label>Total</Label>
                            <Input value={this.total} onChangeText={(txt) => this.total=txt} keyboardType={'numeric'}/>
                        </Item>
                        <Item stackedLabel>
                            <Label>Title</Label>
                            <Input value={this.title} onChangeText={(txt) => this.title=txt}/>
                        </Item>
                        <Item stackedLabel>
                            <Label>Description</Label>
                            <Input value={this.description} onChangeText={(txt) => this.description=txt}/>
                        </Item>
                        <Item stackedLabel>
                            <Label>Date</Label>
                            <TouchableOpacity onPress={() => this.showDateTimePicker()}>
                                <Input value={moment(this.dt).format(CGlobals.brDateFormat)}   editable={false}/>
                            </TouchableOpacity>
                        </Item>
                        <Item stackedLabel>
                            <Label>Vendor</Label>
                            <Picker style={{ width:(Platform.OS === 'ios') ? undefined : 350 }} mode="dropdown" selectedValue={this.selectedVendorID} onValueChange={this.pickerSelected.bind(this)}>
                                { this.createPickerList(this.vendorList) }
                            </Picker>
                        </Item>
                        <Item stackedLabel>
                            <Label>Category</Label>
                            <Picker style={{ width:(Platform.OS === 'ios') ? undefined : 350 }} mode="dropdown" selectedValue={this.selectedCategoryID} onValueChange={this.categoryPickerSelected.bind(this)}>
                                { this.createCategoryPickerList(this.categoryList) }
                            </Picker>
                        </Item>
                        {/*<Item stackedLabel>*/}
                            {/*<Label>Repeat</Label>*/}
                            {/*<Input value={this.description} onChangeText={(txt) => this.description=txt}/>*/}
                        {/*</Item>*/}
                        <DateTimePicker
                            isVisible={this.isDateTimePickerVisible}
                            onConfirm={(dt)=>this.handleDatePicked(dt)}
                            onCancel={this.hideDateTimePicker}
                            date={this.dt}
                        />
                    </Form>
                </Content>
                <ActivityIndicator style={globalStyles.loading} size="large" color="#00ff00"  ref={(ref) => { this.spinner = ref; }} animating={this.loading}/>
            </Container>
        )
    }

    createPickerList(list:EVendor[]){
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

    async pickerSelected(value: string) {
        this.selectedVendorID=value;
        if((!this.selectedVendorID) || (this.selectedVendorID.length<1))return;
        let eVendor=await CGlobals.getVendor(this.selectedVendorID);
        if(eVendor)this.selectedCategoryID=eVendor.categoryID;
        //console.log('selecionou vendor ',this.selectedVendorID,eVendor);
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
        this.selectedCategoryID=value;
    }

    showDateTimePicker() {
        this.isDateTimePickerVisible=true;
    }

    hideDateTimePicker(){
        this.isDateTimePickerVisible=false;
    }

    handleDatePicked(date){
        this.dt=date;
        this.hideDateTimePicker();
    };

    btnBackClicked(){
        Keyboard.dismiss();
        this.props.NavigationStore.navigate({ routeName: CGlobals.VExpenses })
    }

    async btnSaveClicked(){
        Keyboard.dismiss();
        console.log('vai salvar despesa ',this.total, this.title);
        let eExpense=new EExpense();
        eExpense.id=this.expenseID;
        eExpense.userID=CGlobals.userID;
        eExpense.title=this.title;
        eExpense.description=this.description;
        eExpense.vendorID=this.selectedVendorID;
        eExpense.categoryID=this.selectedCategoryID;
        eExpense.dt=this.dt;
        eExpense.total=parseFloat(this.total);
        if(isNaN(eExpense.total) || eExpense.total===0)return CGlobals.alert('Error','Set the total');
        if(!eExpense.title)return CGlobals.alert('Error','Set the title');
        let res = await rest.post('/Expenses/save/', {body: eExpense});
        let obj = res.body;
        if(obj)CGlobals.displayToast('Expense saved','');
        this.btnBackClicked();
    }
}

const styles = StyleSheet.create({
    txtInput: {
        width: 300,
        height: 40,
    },
    picker:{
        backgroundColor:'blue',
        width: undefined
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
