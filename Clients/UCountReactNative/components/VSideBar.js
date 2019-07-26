//region imports
import React from "react";
import {Image, Platform, Dimensions, StyleSheet, BackHandler} from "react-native";
import {Content, List, ListItem, Icon, Container, Left, Right, Badge, Text} from "native-base";
import { observer, inject } from 'mobx-react/native'
import {CGlobals} from "../codes/CGlobals";
const drawerCover = require("../assets/images/drawer-cover.png");
const drawerImage = require("../assets/images/react.png");
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
//endregion


@inject('NavigationStore')
export default class VSideBar extends React.Component {
    static navigationOptions = {title: 'SideBar'};

    constructor(props) {
        super(props);
        //console.log('carregando VSideBar==========================', deviceHeight, deviceWidth);
        this.state = {
            shadowOffsetWidth: 1,
            shadowRadius: 4
        };
    }

    async componentDidMount(){
    }

    render() {
        return (
           <Container>
                <Content bounces={false} style={{flex: 1, backgroundColor: "white", top: -1}}>
                    <Image source={drawerCover} style={styles.drawerCover}/>
                    <Text style={styles.txtUcount}>UCount</Text>
                    {/*<Image square style={styles.drawerImage} source={drawerImage}/>*/}
                    <List dataArray={datas} renderRow={data =>
                        <ListItem button noBorder onPress={() => this.listItemClicked(data.route)}>
                            <Left>
                                <Icon active name={data.icon} style={{color: "#777", fontSize: 26, width: 30}}/>
                                <Text style={styles.text}>{data.name}</Text>
                            </Left>
                            {data.types &&
                            <Right style={{flex: 1}}>
                                <Badge style={{borderRadius: 3, height: 25, width: 72, backgroundColor: data.bg}}>
                                    <Text style={styles.badgeText}>{`${data.types} Types`}</Text>
                                </Badge>
                            </Right>}
                        </ListItem>}
                    />
                </Content>
            </Container>
        );
    }

    listItemClicked(route) {
        this.props.NavigationStore.navigate({ routeName: route});
    }
}

const styles = StyleSheet.create({
    drawerCover: {
        alignSelf: "stretch",
        height: deviceHeight / 3.5,
        width: null,
        position: "relative",
        marginBottom: 10
    },
    txtUcount:{
        backgroundColor:'transparent',
        color:'white',
        fontSize:30,
        textAlign:'center',
        position: "absolute",
        lineHeight: deviceHeight / 3.5,
        width:250
    },
    drawerImage: {
        position: "absolute",
        left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
        top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
        width: 210,
        height: 75,
        resizeMode: "cover"
    },
    text: {
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        fontSize: 16,
        marginLeft: 20
    },
    badgeText: {
        fontSize: Platform.OS === "ios" ? 13 : 11,
        fontWeight: "400",
        textAlign: "center",
        marginTop: Platform.OS === "android" ? -3 : undefined
    }
});

const datas = [
    // {name: "History", route: "VHistory", icon: "clock", bg: "#C5F442"},//todo versao 2.0
    {name: "Expenses", route: "VExpenses", icon: "card", bg: "#C5F442"},
    {name: "Incomes", route: "VIncomes", icon: "cash", bg: "#C5F442"},
    {name: "Categories", route: "VCategories", icon: "list", bg: "#C5F442"},
    // {name: "Reports", route: "VReports", icon: "radio-button-off", bg: "#1EBC7C", types: "9"},//todo versao 2.0
    {name: "Vendors", route: "VVendors", icon: "people", bg: "#C5F442"},
    {name: "Preferences", route: "VConfig", icon: "settings", bg: "#C5F442"},
    {name: "Logout", route: "VLogin", icon: "exit", bg: "#C5F442"},
];
