//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {Body, Button, Container, Content, Footer, FooterTab, Header, Icon, Left, Right, Text, Title} from "native-base";
import {globalStyles} from "../codes/CGlobals";
//endregion

export default class VReports extends React.Component {

    render(){
        return (
            <Container style={globalStyles.container}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.btnDrawerClicked()}>
                            <Icon name="menu" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Reports</Title>
                    </Body>
                    <Right />
                </Header>

                <Content padder>
                    <Text>Content goes here</Text>
                </Content>

                <Footer>
                    <FooterTab>
                        <Button active full>
                            <Text>Footer</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }

    btnDrawerClicked(){
        // console.log('clicou no btn drawer', this.props.navigation.openDrawer());
        // this.props.drawer._root.open();
        this.props.navigation.navigate("DrawerOpen")
    }
}
