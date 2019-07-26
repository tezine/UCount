//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {Body, Button, Container, Content, Footer, Form, Header, Icon, Input, Item, Label, Left, Picker, Right, Spinner, Text, Title, View} from "native-base";
import {CGlobals, globalStyles} from "../../codes/CGlobals";
import {ActivityIndicator, Keyboard, Platform, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import DateTimePicker from 'react-native-modal-datetime-picker';
import {observable} from "mobx";
import {rest} from '../../codes/CGlobals'
import {EIncome} from "../../entities/EIncome";
import moment from "moment/moment";
import { observer, inject } from 'mobx-react/native'
import ECategory from "../../entities/ECategory";
//endregion

@inject('NavigationStore')
@observer
export default class VIncomesEdit extends React.Component{

    //region fields
    @observable loading=false;
    @observable incomeID=this.props.navigation.getParam('incomeID');
    @observable title='';
    @observable description='';
    @observable total;
    @observable dt=new Date();
    @observable isDateTimePickerVisible:boolean=false;
    @observable selectedCategoryID= undefined;
    @observable categoryList:ECategory[]=[];
    //endregion

    constructor(props){
        super(props);
    }

    async componentWillMount() {
        this.categoryList=await CGlobals.getCategories();
        if(!this.incomeID)return;
        this.loading=true;
        let response = await rest.get('/Incomes/getByID/' + CGlobals.userID+'/'+this.incomeID);
        this.loading=false;
        let eIncome:EIncome = response.body;
        this.title=eIncome.title;
        this.description=eIncome.description;
        this.total=eIncome.total.toString();
        this.dt=new Date(eIncome.dt);
        this.selectedCategoryID=eIncome.categoryID;
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
                        <Title>Income Edit</Title>
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
                            <Label>Category</Label>
                            <Picker style={{ width:(Platform.OS === 'ios') ? undefined : 350 }} mode="dropdown" selectedValue={this.selectedCategoryID} onValueChange={this.pickerSelected.bind(this)}>
                                { this.createPickerList(this.categoryList) }
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

    createPickerList(list:ECategory[]){
        let d = list.map((data,i) => {
            return (
                <Picker.Item label={data.name} value={data.id}/>
            )
        });
        if(Platform.OS === 'android'){// no need in ios :P
            d.unshift(<Picker.Item label="Select" />)
        }
        return d;
    }

    pickerSelected(value: string) {
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
        this.props.NavigationStore.navigate({ routeName: CGlobals.VIncomes })
    }

    async btnSaveClicked(){
        Keyboard.dismiss();
        let eIncome=new EIncome();
        eIncome.id=this.incomeID;
        eIncome.userID=CGlobals.userID;
        eIncome.title=this.title;
        eIncome.description=this.description;
        eIncome.categoryID=this.selectedCategoryID;
        eIncome.dt=this.dt;
        eIncome.total=parseFloat(this.total);
        if(isNaN(eIncome.total) || eIncome.total===0)return CGlobals.alert('Error','Set the total');
        if(!eIncome.title)return CGlobals.alert('Error','Set the title');
        let res = await rest.post('/Incomes/save/', {body: eIncome});
        let obj = res.body;
        console.log('resposta:', obj);
        if(obj)CGlobals.displayToast('Income saved','');
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

