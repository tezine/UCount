//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {Body, Button, Container, Content, Footer, FooterTab, Header, Icon, Left, ListItem, Right, Text, Title} from "native-base";
import {CGlobals, globalStyles, rest} from "../codes/CGlobals";
import {Etransaction} from "../entities/ETransaction";
import {observable} from "mobx";
import { observer, inject } from 'mobx-react/native'
import {FlatList} from "react-native";
//endregion

@inject('NavigationStore')
@observer
export default class VHistory extends React.Component {

    @observable transactionList=[];
    @observable pageNumber=0;

    constructor() {
        super();
    }

    async componentWillMount() {
        await this.getTransactions(this.pageNumber);
    }

    async getTransactions(pageNumber:number):Promise<void>{
        let response = await rest.get('/History/getAll/' + CGlobals.userID);
        this.transactionList= observable(response.body);
        for(let etransaction:Etransaction of this.transactionList){
            console.log('transaction:', etransaction.title);
        }
    }

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
                        <Title>History</Title>
                    </Body>
                    <Right />
                </Header>

                <Content padder>
                    <FlatList
                        data={this.transactionList}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.title}
                    />
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

    renderItem = ({item}) => {
        return (
            <ListItem style={{marginLeft: 0}}>
                <Body>
                    <Text>{item.title}</Text>
                </Body>
            </ListItem>
        );
    };

    btnDrawerClicked(){
        this.props.navigation.navigate('DrawerOpen');
    }
}
