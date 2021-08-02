import { View, StyleSheet, Text, ScrollView, TextInput, Image, ActivityIndicator, TouchableOpacity, Button } from "react-native";
import Background from "../components/Background";
import UserContext from '../helpers/UserData'
import React, { useContext, useEffect, useState } from 'react'
import { DataTable } from "react-native-paper";
import { useIsFocused } from "@react-navigation/core";
export default function CartScreen({ route, navigation }) {
    const { userIDcontext, userNamecontext } = useContext(UserContext);
    const [UserID, setUserID] = userIDcontext;
    const [UserName, setUserName] = userNamecontext;
    const [dataCart, setDataCart] = useState([]);
    const [dataParent, setDataParent] = useState([]);
    const [isLoading, setisLoading] = useState(false)
    const [active, setactive] = useState(true)
    const [checkout, setcheckout] = useState(false)
    const [Total, setTotal] = useState(0)
    const isFocused = useIsFocused();
    const ConvertJsonDateToDate = (date) => {
        var parsedDate = new Date(parseInt(date.substr(6)));
        var newDate = new Date(parsedDate);
        var month = ('0' + (newDate.getMonth() + 1)).slice(-2);
        var day = ('0' + newDate.getDate()).slice(-2);
        var year = newDate.getFullYear();
        return day + "/" + month + "/" + year;
    }
    const getItemsCart = () => {
        if (UserID != 0) {
            setisLoading(true)
            fetch("https://bambai.online/Admin/APIBamBai/ViewCart", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: UserID
                })
            }).then(response => response.json())
                .then((responseJson) => {
                    for (var i = 0; i < responseJson.data.length; i++) {
                        // Loop through each property in the Array.
                        for (var property in responseJson.data[i]) {
                            if (responseJson.data[i].hasOwnProperty(property)) {
                                var resx = /Date\(([^)]+)\)/;
                                // Checking Date with regular expresion.
                                if (resx.test(responseJson.data[i][property])) {
                                    // Setting Date in dd/MM/yyyy format.
                                    responseJson.data[i][property] = ConvertJsonDateToDate(responseJson.data[i][property]);
                                }
                            }
                        }
                    }
                    setisLoading(false)
                    console.log(responseJson);
                    if (responseJson.code == 200) {
                        setDataCart(responseJson.data)
                        setDataParent(responseJson.data)
                        let msgTotal = responseJson.data.reduce(function (prev, cur) {
                            return prev + cur.Thanhtien;
                        }, 0);
                        setTotal(msgTotal)
                    }
                }).catch(error => console.log(error));
        }
    }
    useEffect(() => {
        if (isFocused) {
            getItemsCart();
        }
    }, [isFocused]);
    const updateCart = (cartid, soluong) => {
        setactive(false)
        let dataupdate = [];
        for (var i in dataCart) {
            if (dataCart[i].CartID == cartid) {
                dataCart[i].Quantity += soluong;
                if (soluong > 0) {
                    dataCart[i].Thanhtien += dataCart[i].ProductUnit;
                } else {
                    dataCart[i].Thanhtien -= dataCart[i].ProductUnit;
                }
            }
            dataupdate.push(dataCart[i])
        }
        let msgTotal = dataupdate.reduce(function (prev, cur) {
            return prev + cur.Thanhtien;
        }, 0);
        setTotal(msgTotal)
        setDataCart(dataupdate)
        fetch("https://bambai.online/Admin/APIBamBai/updateCart", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cartID: cartid,
                soluong: soluong
            }),
        }).then(response => response.json())
            .then((responseJson) => {
                if (responseJson.code == 200) {
                    setDataParent(dataCart)
                } else if (responseJson.code == 500) {
                    setDataCart(dataParent)
                    alert("cart not updated")
                }
                setactive(true)
            }).catch(error => console.log(error));

    }
    const deleteCart = (cartid) => {
        setactive(false)
        let dataupdate = [];
        for (var i in dataCart) {
            if (dataCart[i].CartID != cartid) {
                dataupdate.push(dataCart[i])
            }

        }
        let msgTotal = dataupdate.reduce(function (prev, cur) {
            return prev + cur.Thanhtien;
        }, 0);
        setTotal(msgTotal)
        setDataCart(dataupdate)
        fetch("https://bambai.online/Admin/APIBamBai/deleteCart", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cartID: cartid
            }),
        }).then(response => response.json())
            .then((responseJson) => {
                if (responseJson.code == 200) {
                    setDataParent(dataCart)
                } else if (responseJson.code == 500) {
                    setDataCart(dataParent)
                    alert("cart not updated")
                }
                setactive(true)
            }).catch(error => console.log(error));

    }
    const Checkout = () => {
        setcheckout(true)
        fetch("https://bambai.online/Admin/APIBamBai/checkout", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: UserID
            }),
        }).then(response => response.json())
            .then((responseJson) => {
                if (responseJson.code == 200) {
                    getItemsCart();
                    alert("check out completed")
                } else if (responseJson.code == 500) {
                    alert("Error checkout")
                }
                setcheckout(false)
            }).catch(error => console.log(error));
    }
    const Delay =()=>{
        alert("Sống chậm thôi bạn trẻ")
    }
    return (
        <View style={{flex:1, width:'100%' }}>
            {isLoading ? <ActivityIndicator style={{padding:100}} size="large" color="#0000ff" /> :
                <View style={styles.container}>
                    {(UserID == 0) ? <Text style={{ padding: 50, alignItems: 'center', fontWeight: 'bold', fontSize: 40 }}>Vui lòng đăng nhập để xem giỏ hàng của bạn</Text> :
                        <ScrollView style={{flex:1}}>

                            {(dataCart.length == 0) ? <Text style={{ fontSize: 30, fontWeight: 'bold', padding: 50 }}>Giỏ hàng trống</Text> :
                                <DataTable style={styles.DataTable}>
                                    <DataTable.Header>
                                        <DataTable.Title style={styles.textContent}>Image</DataTable.Title>
                                        <DataTable.Title numeric style={styles.textContent}> UnitCost</DataTable.Title>
                                        <DataTable.Title numeric style={styles.textQty}>Quantity</DataTable.Title>
                                        {/* <DataTable.Title numeric style={styles.textContent}>Total</DataTable.Title> */}
                                        <DataTable.Title style={styles.textContent}>Action</DataTable.Title>
                                    </DataTable.Header>

                                    {dataCart.map((c) =>
                                        <DataTable.Row key={c.CartID}>
                                            <DataTable.Cell style={styles.textContent}> <Image style={styles.cartImg} source={{ uri: 'https://bambai.online/Content/images/items/' + c.Image }} /></DataTable.Cell>
                                            <DataTable.Cell  style={styles.textContent}>{c.ProductUnit}</DataTable.Cell>
                                            <DataTable.Cell numeric style={styles.textQty}>
                                                {(c.Quantity > 1) ?
                                                    <View style={{ flex: 1,  flexDirection: 'row' }}>
                                                        <TouchableOpacity style={{ marginRight: 8 }} onPress={(active == true) ? () => updateCart(c.CartID, -1) : () => Delay()}>
                                                            <Image style={{ width: 15, height: 15 }} source={{ uri: 'https://image.flaticon.com/icons/png/512/25/25232.png' }} />
                                                        </TouchableOpacity>
                                                        <Text style={{ fontSize: 15, width: 10, height: 20 }}>{c.Quantity}</Text>
                                                        <TouchableOpacity style={{ marginLeft: 8 }} onPress={(active == true) ? () => updateCart(c.CartID, 1) : () => Delay()}>
                                                            <Image style={{ width: 15, height: 15 }} source={{ uri: 'https://image.flaticon.com/icons/png/512/1828/1828921.png' }} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    :
                                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                                        <Text style={{fontSize: 15, width: 10, height: 20}}>{c.Quantity}</Text>
                                                        <TouchableOpacity style={{ marginLeft: 8 }} onPress={(active == true) ? () => updateCart(c.CartID, 1) : () => Delay()}>
                                                            <Image style={{ width: 15, height: 15 }} source={{ uri: 'https://image.flaticon.com/icons/png/512/1828/1828921.png' }} />
                                                        </TouchableOpacity>
                                                    </View>
                                                }
                                            </DataTable.Cell>
                                            {/* <DataTable.Cell numeric style={styles.textContent}>{c.ProductUnit * c.Quantity}</DataTable.Cell> */}
                                            <DataTable.Cell numeric style={styles.textContent}>
                                                <TouchableOpacity style={{ marginLeft: 8 }} onPress={(active == true) ? () => deleteCart(c.CartID) : () => Delay()}>
                                                    <Image style={{ width: 15, height: 15 }} source={{ uri: 'https://image.flaticon.com/icons/png/512/1828/1828843.png' }} />
                                                </TouchableOpacity></DataTable.Cell>
                                        </DataTable.Row>)
                                    }
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Total:{Total}</Text>
                                    {checkout ? <ActivityIndicator size="large" color="#0000ff" /> :
                                        <Button onPress={() => Checkout()} title="Checkout" />}
                                </DataTable>
                            }

                        </ScrollView>
                    }
                </View >
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        marginTop: 40,
        width: '100%',
        height:'100%',
        backgroundColor: '#ffffff',
        justifyContent:'center',
        alignContent:'center'
    },
    DataTable: {
        width: '100%',
    },
    cartImg: {
        width: 40,
        height: 30,
    },
    textContent: {
        flex: 3,
        padding: 7,
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        textAlign: 'center',
    },
    textQty: {
        flex: 3,
        padding: 7,
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        textAlign: 'center',
    }
});