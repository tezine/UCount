//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {observable} from "mobx";
import { StyleSheet} from "react-native";
import {CGlobals, globalStyles, rest} from '../../codes/CGlobals'
import {Body, Button, Card, CardItem, Container, Content, Form, Header, Icon, Input, Item, Label, Left, Right, Text, Title} from "native-base";
import { observer, inject } from 'mobx-react/native'
//endregion

@inject('NavigationStore')
@observer
export default class VConfig extends React.Component {

    @observable name = '';

    constructor() {
        super();
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
                        <Title>Preferences</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <Card>
                        <CardItem button onPress={() => this.props.NavigationStore.navigate({ routeName: CGlobals.VConfigHelp})}>
                            <Icon active name="help-circle" />
                            <Text>Help</Text>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </CardItem>
                        <CardItem button onPress={() => this.props.NavigationStore.navigate({ routeName: CGlobals.VConfigProfile})}>
                            <Icon active name="contact" />
                            <Text>Profile</Text>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </CardItem>
                        {/*<CardItem button onPress={() => this.props.NavigationStore.navigate({ routeName: CGlobals.VAccounts})}>*/}
                            {/*<Icon active name="people" />*/}
                            {/*<Text>Accounts</Text>*/}
                            {/*<Right>*/}
                                {/*<Icon name="arrow-forward" />*/}
                            {/*</Right>*/}
                        {/*</CardItem>*/}
                        <CardItem button onPress={() => this.props.NavigationStore.navigate({ routeName: CGlobals.VConfigAbout})}>
                            <Icon active name="information-circle" />
                            <Text>About</Text>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }


    btnDrawerClicked(){
        this.props.navigation.navigate(CGlobals.DrawerOpen);
    }

}

const styles = StyleSheet.create({
    txtInput: {
        width: 300,
        height: 40,
    },
});