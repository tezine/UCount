//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {FlatList, Image, StyleSheet, Text, View} from "react-native";
import {Body, Button, Container, Content, Drawer, Footer, Header, Icon, Left, Right, Title} from "native-base";
import VSideBar from "../components/VSideBar";
//endregion

export default class VDashboard extends React.Component {

    static navigationOptions = {title: 'Dashboard'};

    constructor(props){
        super(props);
        console.log('criando dashboard===================================');
    }

    componentDidMount(){
     //   this.btnDrawerClicked();
    }

    render() {
        return (
            <View>
                <Text>
                    Ola dashboard
                </Text>
            </View>
            /*<Drawer
                ref={(ref) => { this.drawer = ref; }}
                content={<VSideBar navigation={this.props.navigation} />}
                onClose={() => this.closeDrawer()}
            >
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.btnDrawerClicked()}>
                            <Icon name="menu" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>UCount</Title>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name="bulb" />
                        </Button>
                    </Right>
                </Header>
            </Drawer>*/

            /*<Container>
                <Header>
                    <Left>
                        <Button transparent onPress={()=>this.btnDrawerClicked()} title={'menu'}>
                            <Icon name='menu' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>UCount Dashboard</Title>
                    </Body>
                    <Right />
                </Header>
                <Content style={styles.container}>
                    <Drawer ref={(ref) => { this.drawer = ref; }}
                            content={
                                <VSideBar navigation={this.props.navigation} />
                            }
                            onClose={() => this.closeDrawer()} >
                    </Drawer>
                    <Text>Ola</Text>
                </Content>
                <Footer>
                    <Text>Como vai</Text>
                </Footer>
            </Container>*/

        );
    }

    closeDrawer() {
        this.drawer._root.close()
    };

    btnDrawerClicked() {
        this.drawer._root.open();
        console.log('abriu o drawer');
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'gray',
        paddingTop: 22
    },
    item: {
        padding: 10,
        fontSize: 20,
        fontWeight:'bold',
        height: 35,
    },
});
