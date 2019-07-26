//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text, Title, View} from "native-base";
import {CGlobals, globalStyles, rest} from "../../codes/CGlobals";
import {EIncome} from "../../entities/EIncome";
import {ActivityIndicator, Alert, FlatList, ListView, StyleSheet} from "react-native";
import moment from "moment/moment";
import {action, computed, observable} from "mobx";
import {observer, inject} from 'mobx-react/native'
import Ripple from "react-native-material-ripple";
//endregion


@inject('NavigationStore')
@observer
export default class VIncomes extends React.Component {

    //region fields
    @observable incomesList: EIncome[] = [];
    @observable pageNumber = 0;
    @observable loading=false;
    @observable selectedItem={};
    @computed get dataSource() {return this.ds.cloneWithRowsAndSections(this.convertArrayToMap());}
    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    //endregion

    constructor() {
        super();
    }

    async componentWillMount() {
        await this.getIncomes(this.pageNumber);
    }

    async getIncomes(pageNumber: number): Promise<void> {
        this.loading=true;
        let response = await rest.get('/Incomes/getAll/' + CGlobals.userID, {
            body: {
                listCount: CGlobals.listCount,
                pageNumber: pageNumber,
                orderBy: {dt: 'DESC'}
            }
        });
        this.loading=false;
        let incomesList: EIncome[] = response.body;
        if(incomesList) this.incomesList = observable(incomesList);
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
                        <Title>Incomes</Title>
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
                <ActivityIndicator style={globalStyles.loading} size="large" color="#00ff00"  ref={(ref) => { this.spinner = ref; }} animating={this.loading}/>
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

    listItemClicked(item: EIncome) {
        this.props.NavigationStore.navigate({routeName: CGlobals.VIncomeEdit, params: {incomeID: item.id}});
    }

    btnDrawerClicked() {
        this.props.navigation.navigate(CGlobals.DrawerOpen);
    }

    btnAddClicked() {
        this.props.NavigationStore.navigate({routeName: CGlobals.VIncomeEdit, params: {incomeID: undefined}});
    }

    async btnDeleteClicked(eIncome:EIncome, secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        Alert.alert(
            'Confirmation',
            'Confirm the removal?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => this.deleteIncome(eIncome)},
            ],
            { cancelable: true }
        );
    }

    async deleteIncome(eIncome){
        let response= await rest.del('/Incomes/deleteByID/' + CGlobals.userID + '/' + eIncome.id);
        if (response.body === 'true') {
            this.incomesList.remove(eIncome);
            CGlobals.displayToast('Income removed','');
        }
    }

    convertArrayToMap() {
        let sectionMap = {};
        this.incomesList.forEach(function (eIncome) {
            let incomeBRDate = moment(eIncome.dt).format(CGlobals.brDateFormat);
            if (!sectionMap[incomeBRDate]) {
                sectionMap[incomeBRDate] = [];// Create an entry in the map for the category if it hasn't yet been created
            }
            sectionMap[incomeBRDate].push(eIncome);
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
    listItem: {
        paddingLeft: 20,
        //lineHeight:45
    },
    total: {
        color: 'darkgreen',
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
