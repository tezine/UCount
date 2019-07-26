//region imports
/**
 * @author  bruno@tezine.com
 */
import React from "react";
import {observable} from "mobx";
import {ActivityIndicator, Keyboard, StyleSheet} from "react-native";
import {CGlobals, globalStyles, rest} from '../../codes/CGlobals'
import {Body, Button, Container, Content, Form, Header, Icon, Input, Item, Label, Left, Right, Title} from "native-base";
import ECategory from "../../entities/ECategory";
import { observer, inject } from 'mobx-react/native'
//endregion

@inject('NavigationStore')
@observer
export default class VCategoriesEdit extends React.Component{

    //region fields
    @observable categoryID=this.props.navigation.getParam('categoryID');
    @observable name='';
    @observable description='';
    @observable loading=false;
    //endregion

    async componentWillMount() {
        if(!this.categoryID)return;
        this.loading=true;
        let response = await rest.get('/Categories/getByID/' + CGlobals.userID+'/'+this.categoryID);
        this.loading=false;
        let eCategory:ECategory = response.body;
        this.name=eCategory.name;
        this.description=eCategory.description;
        //console.log('retornou:',this.name);
    }

    render(){
        return(
            <Container  style={globalStyles.container}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.btnBackClicked()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Category Edit</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={()=>this.btnSaveClicked()}>
                            <Icon name="checkmark" />
                        </Button>
                    </Right>
                </Header>
                <Content >
                    <Form>
                        <Item stackedLabel>
                            <Label>Name</Label>
                            <Input  value={this.name} onChangeText={(txt) => this.name=txt}/>
                        </Item>
                        <Item stackedLabel>
                            <Label>Description</Label>
                            <Input value={this.description} onChangeText={(txt) => this.description=txt}/>
                        </Item>
                        {/*<Item floatingLabel last>*/}
                            {/*<Label>Icon</Label>*/}
                            {/*<Input value={this.description} onChangeText={(txt) => this.description=txt}/>*/}
                        {/*</Item>*/}
                    </Form>
                </Content>
                <ActivityIndicator style={globalStyles.loading} size="large" color="#00ff00"  ref={(ref) => { this.spinner = ref; }} animating={this.loading}/>
            </Container>
        )
    }

    btnBackClicked(){
        this.props.NavigationStore.navigate({ routeName: CGlobals.VCategories })
    }

    async btnSaveClicked(){
        console.log('vai salvar categoria ',this.name, this.description);
        Keyboard.dismiss();
        let eCategory=new ECategory();
        eCategory.id=this.categoryID;
        eCategory.userID=CGlobals.userID;
        eCategory.name=this.name;
        eCategory.description=this.description;
        if(!eCategory.name || eCategory.name.length===0)return CGlobals.alert('Error','Set the name');
        let res = await rest.post('/Categories/save/', {body: eCategory});
        let obj = res.body;
        if(obj)CGlobals.displayToast('Category saved','');
        this.btnBackClicked();
    }
}

const styles = StyleSheet.create({
    txtInput: {
        width: 300,
        height: 40,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionNaousada:{
        paddingLeft: 20,
        lineHeight:45
    },
});
