//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {observable} from "mobx";
import {StyleSheet, WebView} from "react-native";
import {CGlobals, globalStyles, rest} from '../../codes/CGlobals'
import {Body, Button, Card, CardItem, Container, Content, Form, Header, Icon, Input, Item, Label, Left, Right, Text, Title, View} from "native-base";
import { observer, inject } from 'mobx-react/native'
//endregion

@inject('NavigationStore')
@observer
export default class VConfigHelp extends React.Component {

    @observable name = '';
    @observable aboutContent="<b>Overview</b><br/> " +
        "UCount is designed to be a Personal Expense and Income Tracking Tool. It has the basic functionality to control your finance divided into categories, accounts and vendors.  " +
        "UCount also provides password protected login and it allows you to transfer between accounts or into your <i>Savings</i>.<br/><br/> " +
        "<b>Expenses</b><br/> " +
        "<i>Expenses</i> shows all your expenses from within a period. The total is displayed in the bar on the top.<br/><br/> " +
        "<b>Incomes</b><br/> " +
        "<i>Incomes</i> shows all your income from within a period. The total is displayed in the bar on the top.<br/><br/> " +
        "<b>Categories</b><br/> " +
        "<i>Categories</i> allows you to group your expenses, budgets, transfers and savings so you can generate reports. <br/><br/> " +
        "<b>Vendors</b><br/> " +
        "<i>Vendors</i> allows you to fine tune your expense. When you select a vendor into a new expense, UCount picks the vendor's category automatically for you. <br/><br/> " +
        "<b>Accounts</b><br/> " +
        "<i>Accounts</i> allows to one user track several bank/credit accounts in the same application or to have one account for each user. For instance, you may have one account named <i>Child</i> to keep " +
        "track of your child expenses, and another account named <i>MySelf</i> to keep track of your own transactions. <br/><br/>           ";

    constructor() {
        super();
    }

    render(){
        return (
            <Container  style={globalStyles.container}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.btnBackClicked()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Help</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content contentContainerStyle={{flex:1,backgroundColor:'gray'}}>
                    <WebView source={{html: this.aboutContent}}/>
                </Content>
            </Container>
        );
    }

    btnBackClicked(){
        this.props.NavigationStore.navigate({ routeName: CGlobals.VConfig })
    }
}