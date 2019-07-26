//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {StyleSheet} from "react-native";
import {CGlobals, globalStyles, rest} from '../../codes/CGlobals'
import {Body, Button, Card, CardItem, Container, Content, Form, Header, Icon, Input, Item, Label, Left, Right, Text, Title} from "native-base";
import {action, computed, observable} from "mobx";
import {observer, inject} from 'mobx-react/native'
//endregion

@inject('NavigationStore')
@observer
export default class VConfigAbout extends React.Component {

    @observable name = '';

    constructor() {
        super();
    }

    render() {
        return (
            <Container style={globalStyles.container}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.btnBackClicked()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>About</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content contentContainerStyle={{justifyContent:'center',flex:1,alignItems:'center'}}>
                    <Text style={styles.lblAbout}>
                        UCount React Native
                    </Text>
                </Content>
            </Container>
        )
    }

    btnBackClicked(){
        this.props.NavigationStore.navigate({ routeName: CGlobals.VConfig })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#263238',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lblAbout: {
        fontWeight: 'bold',
    textAlignVertical: 'center',
        //color: 'white',
        fontSize: 30
    },
});
