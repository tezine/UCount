//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {Body, Button, Container, Content, Footer, FooterTab, Header, Icon, Left, List, ListItem, Right, Text, Title} from "native-base";
import {CGlobals, globalStyles, rest} from "../../codes/CGlobals";
import {EVendor} from "../../entities/EVendor";
import {ActivityIndicator, FlatList, StyleSheet} from "react-native";
import {ListView, TouchableOpacity, View} from 'react-native';
import {action, computed, observable} from "mobx";
import {observer, inject} from 'mobx-react/native'
import {Alert} from 'react-native';
import Ripple from "react-native-material-ripple";
//endregion

@inject('NavigationStore')
@observer
export default class VVendors extends React.Component {

    //region fields
    @observable pageNumber = 0;
    @observable loading=false;
    @observable vendorsList: EVendor[] = [];
    @action add = title => {
        let eVendor = new EVendor();
        eVendor.name = title;
        this.vendorsList.push(eVendor);
    };
    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    @computed get dataSource() {return this.ds.cloneWithRows(this.vendorsList.slice());}
    //endregion

    async componentWillMount() {
        await this.getVendors(this.pageNumber);
    }

    async getVendors(pageNumber: number): Promise<void> {
        try {
            this.loading=true;
            let response = await rest.get('/Vendors/getAll/' + CGlobals.userID, {
                body: {
                    listCount: CGlobals.listCount,
                    pageNumber: pageNumber,
                    orderBy: {name: 'ASC'}
                }
            });
            this.loading=false;
            this.vendorsList = observable(response.body);
        } catch (err) {
            console.log('aconteceu erro:', err);
        }
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
                        <Title>Vendors</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.btnAddClicked()}>
                            <Icon name='add'/>
                        </Button>
                    </Right>
                </Header>

                <Content>
                    <List
                        enableEmptySections={true}
                        dataSource={this.dataSource}
                        renderRow={(item, index) => this.renderItem(item, index)}
                        rightOpenValue={-75}
                        renderRightHiddenRow={(item, secId, rowId, rowMap) =>
                            <Button full danger onPress={_ => this.btnDeleteClicked(item, secId, rowId, rowMap)}>
                                <Icon active name="trash"/>
                            </Button>
                        }
                    />
                </Content>

                <Footer>
                    <FooterTab>
                        <Button active full>
                            <Text>{this.vendorsList.length} vendors</Text>
                        </Button>
                    </FooterTab>
                </Footer>
                <ActivityIndicator style={globalStyles.loading} size="large" color="#00ff00"  ref={(ref) => { this.spinner = ref; }} animating={this.loading}/>
            </Container>
        )
    }

    renderItem(item, index) {
        return (
            <Ripple onPress={() => this.listItemClicked(item)}>
                <ListItem>
                    <Text style={styles.listItem} key={index} >{item.name}</Text>
                </ListItem>
            </Ripple>
        );
    };

    listItemClicked(item: EVendor) {
        this.props.NavigationStore.navigate({routeName: CGlobals.VVendorsEdit, params: {vendorID: item.id}});
    }

    btnDrawerClicked() {
        this.props.navigation.navigate(CGlobals.DrawerOpen);
    }

    btnAddClicked() {
        //listStore.add('Lorem ipsum dolor sit amet');
        this.props.NavigationStore.navigate({routeName: CGlobals.VVendorsEdit,params:{vendorID:undefined}});
    }

    async btnDeleteClicked(eVendor: EVendor, secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        Alert.alert(
            'Confirmation',
            'Confirm the removal?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => this.deleteVendor(eVendor)},
            ],
            { cancelable: true }
        );
    }

    async deleteVendor(eVendor){
        let response= await rest.del('/Vendors/deleteByID/' + CGlobals.userID + '/' + eVendor.id);
        if (response.body === 'true') {
            this.vendorsList.remove(eVendor);
            CGlobals.displayToast('Vendor removed','');
        }
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
        // lineHeight: 45
    },
});