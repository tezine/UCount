//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {Body, Button, Container, Content, Footer, FooterTab, Header, Icon, Left, List, ListItem, Right, Text, Title} from "native-base";
import {CGlobals, globalStyles, rest} from "../../codes/CGlobals";
import ECategory from "../../entities/ECategory";
import {ActivityIndicator, Alert, FlatList, ListView, StyleSheet} from "react-native";
import {action, computed, observable} from "mobx";
import {observer, inject} from 'mobx-react/native'
import Ripple from "react-native-material-ripple";
//endregion

@inject('NavigationStore')
@observer
export default class VCategories extends React.Component {

    //region fields
    @observable pageNumber = 0;
    @observable loading = false;
    @observable categoryList: ECategory[] = [];

    @computed get dataSource() {
        return this.ds.cloneWithRows(this.categoryList.slice());
    }

    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

    //endregion

    constructor() {
        super();
    }

    async componentWillMount() {
        await this.getCategories(this.pageNumber);
    }

    async getCategories(pageNumber: number): Promise<void> {
        this.loading = true;
        let response = await rest.get('/Categories/getAll/' + CGlobals.userID);
        this.loading = false;
        this.categoryList = observable(response.body);
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
                        <Title>Categories</Title>
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
                            <Text>{this.categoryList.length} categories</Text>
                        </Button>
                    </FooterTab>
                </Footer>
                <ActivityIndicator style={globalStyles.loading} size="large" color="#00ff00" ref={(ref) => {this.spinner = ref;}} animating={this.loading}/>
            </Container>
        )
    }

    renderItem(item, index) {
        return (
            <Ripple onPress={() => this.listItemClicked(item,index)}>
                <ListItem>
                    <Text style={styles.listItem} key={index} >{item.name}</Text>
                </ListItem>
            </Ripple>
        );
    };

    listItemClicked(item: ECategory, index) {
        this.props.NavigationStore.navigate({routeName: CGlobals.VCategoriesEdit, params: {categoryID: item.id}});
    }

    btnDrawerClicked() {
        this.props.navigation.navigate(CGlobals.DrawerOpen);
    }

    btnAddClicked() {
        this.props.NavigationStore.navigate({routeName: CGlobals.VCategoriesEdit, params: {categoryID: undefined}});
    }

    async btnDeleteClicked(eCategory: ECategory, secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        Alert.alert(
            'Confirmation',
            'Confirm the removal?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => this.deleteCategory(eCategory)},
            ],
            {cancelable: true}
        );
    }

    async deleteCategory(eCategory: ECategory) {
        let response = await rest.del('/Categories/deleteByID/' + CGlobals.userID + '/' + eCategory.id);
        if (response.body === 'true') {
            this.categoryList.remove(eCategory);
            CGlobals.displayToast('Category removed', '');
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
        // lineHeight:45
    },
});
