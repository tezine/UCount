//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {Body, Button, Container, Content, Footer, FooterTab, Header, Icon, Left, List, ListItem, Right, Text, Title, View} from "native-base";
import {CGlobals, globalStyles} from "../../codes/CGlobals";
import {ActivityIndicator, Alert, ListView, SectionList, StyleSheet} from "react-native";
import {rest} from '../../codes/CGlobals'
import EExpense from "../../entities/EExpense";
import moment from "moment";
import Ripple from "react-native-material-ripple";
import {action, computed, observable} from "mobx";
import {observer, inject} from 'mobx-react/native'
//endregion

@inject('NavigationStore')
@observer
export default class VExpenses extends React.Component {

    //region fields
    @observable expenseList: EExpense[] = [];
    @observable pageNumber = 0;
    @observable loading = false;

    @computed get dataSource() {
        return this.ds.cloneWithRowsAndSections(this.convertArrayToMap());
    }

    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});

    //endregion

    constructor(props) {
        super(props);
    }

    async componentWillMount() {
        await this.getExpenses(this.pageNumber);
    }

    async getExpenses(pageNumber: number) {
        this.loading = true;
        let response = await rest.get('/Expenses/getAll/' + CGlobals.userID, {
            body: {
                listCount: CGlobals.listCount,
                pageNumber: pageNumber,
                orderBy: {dt: 'DESC'}
            }
        });
        this.loading = false;
        let expenseList: EExpense[] = response.body;
        this.expenseList = observable(expenseList);
    }


    render() {
        return (
            <Container style={globalStyles.container}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.btnDrawerClicked()}>
                            <Icon name="menu"/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Expenses</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.btnAddClicked()}>
                            <Icon name='add'/>
                        </Button>
                    </Right>
                </Header>

                <Content>
                    <List
                        enableEmptySections={false}
                        dataSource={this.dataSource}
                        renderRow={(item) => this.renderItem(item)}
                        renderSectionHeader={(sectionData, category) => this.renderSectionHeader(sectionData, category)}
                        rightOpenValue={-75}
                        renderRightHiddenRow={(item, secId, rowId, rowMap) =>
                            <Button full danger onPress={_ => this.btnDeleteClicked(item, secId, rowId, rowMap)}>
                                <Icon active name="trash"/>
                            </Button>
                        }
                    />
                </Content>
                <ActivityIndicator style={globalStyles.loading} size="large" color="#00ff00" ref={(ref) => {this.spinner = ref;}} animating={this.loading}/>
            </Container>
        )
    }

    renderSectionHeader(sectionData, category) {
        return (
            <ListItem itemDivider>
                <Text>{category}</Text>
            </ListItem>);
    }

    renderItem(item) {
        return (
            <Ripple onPress={() => this.listItemClicked(item)}>
            <ListItem style={styles.ripple}>
                    <View style={{flex: 1}}>
                        <Text>{item.title}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={styles.total}>{item.total}</Text>
                    </View>
            </ListItem>
            </Ripple>
        );
    };

    listItemClicked(item: EExpense) {
        this.props.NavigationStore.navigate({routeName: CGlobals.VExpensesEdit, params: {expenseID: item.id}});
    }

    btnDrawerClicked() {
        this.props.navigation.navigate(CGlobals.DrawerOpen);
    }

    btnAddClicked() {
        this.props.NavigationStore.navigate({routeName: CGlobals.VExpensesEdit, params: {expenseID: undefined}});
    }

    async btnDeleteClicked(eExpense: EExpense, secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        Alert.alert(
            'Confirmation',
            'Confirm the removal?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => this.deleteExpense(eExpense)},
            ],
            {cancelable: true}
        );
    }

    async deleteExpense(eExpense: EExpense) {
        let response = await rest.del('/Expenses/deleteByID/' + CGlobals.userID + '/' + eExpense.id);
        if (response.body === 'true') {
            this.expenseList.remove(eExpense);
            CGlobals.displayToast('Expense removed', '');
        }
    }

    convertArrayToMap() {
        let sectionMap = {};
        this.expenseList.forEach(function (eExpense) {
            let incomeBRDate = moment(eExpense.dt).format(CGlobals.brDateFormat);
            if (!sectionMap[incomeBRDate]) {
                sectionMap[incomeBRDate] = [];// Create an entry in the map for the category if it hasn't yet been created
            }
            sectionMap[incomeBRDate].push(eExpense);
        });
        return sectionMap;
    }
}


const styles = StyleSheet.create({
    sectionHeader: {
        backgroundColor: '#e5e5e5',
        paddingRight: 20,
        textAlign: 'right',
        alignItems: 'center',
        fontWeight: 'bold',
        lineHeight: 35
    },
    total: {
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'right',
        fontSize:20
    },
    ripple: {
        flex: 1,
        flexDirection: 'row',
        alignItems:'stretch',
        paddingLeft: 20,
    },
});
