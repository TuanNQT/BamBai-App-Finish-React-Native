import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react"
import { View, StyleSheet, Text, ScrollView, Image, ActivityIndicator } from "react-native"
import { DataTable } from "react-native-paper";
import UserContext from '../helpers/UserData'
import { useContext } from 'react';
import BackButton from '../components/BackButton'
import { Grid, Row, col, Col } from "react-native-easy-grid";
export default function DetailsOrder({ route, navigation }) {
    const { OrderID } = route.params ?? {};
    const { userIDcontext, userNamecontext } = useContext(UserContext);
    const [UserID, setUserID] = userIDcontext;
    const [data, setdata] = useState([]);
    const isFocused = useIsFocused();
    const [isLoading, setisLoading] = useState(false);
    const [Total, setTotal] = useState(0)
    const getOrderItem = () => {
        if (UserID != 0) {
            setisLoading(true)
            fetch("https://bambai.online/APIBamBai/viewOrderDetails", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Orid: OrderID
                })
            }).then(response => response.json())
                .then((responseJson) => {
                    setisLoading(false)
                    console.log(responseJson);
                    if (responseJson.code == 200) {
                        setdata(responseJson.orderdetails)
                        let msgTotal = responseJson.orderdetails.reduce(function (prev, cur) {
                            return prev + cur.thanhtien;
                        }, 0);
                        setTotal(msgTotal)
                    }
                }).catch(error => console.log(error));
        }
    }
    useEffect(() => {
        if (isFocused) {
            getOrderItem();
        }
    }, [isFocused]);
    return (
        <View style={{ width: '100%', flex: 1 }}>
            <BackButton goBack={navigation.goBack} />
            <View style={{ flex: 1 }}>
                {isLoading ? <ActivityIndicator style={{ padding: 100 }} size="large" color="#0000ff" /> :
                    <View style={styles.container}>
                        <ScrollView style={{ flex: 1 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Chi tiết đơn hàng</Text>
                            <Grid>
                                <Row style={styles.row}>
                                    <Col style={styles.col} size={30}><Text style={styles.text}>Ảnh</Text></Col>
                                    <Col style={styles.col} size={20}><Text style={styles.text}>Đơn giá</Text></Col>
                                    <Col style={styles.col} size={20}><Text style={styles.text}>Số lượng</Text></Col>
                                    <Col style={styles.col} size={30}><Text style={styles.text}>Thành tiền</Text></Col>
                                </Row>
                                {data.map((c) => 
                                    <Row key={c.ProductID} style={styles.row}>
                                        <Col style={styles.col} size={30}><Image style={styles.cartImg} source={{ uri: 'https://bambai.online/Content/images/items/' + c.ProductImage }} /></Col>
                                        <Col style={styles.col} size={20}><Text style={styles.text}>{c.UnitCost}</Text></Col>
                                        <Col style={styles.col} size={20}><Text style={styles.text}> {c.Quantity}</Text></Col>
                                        <Col style={styles.col} size={30}><Text style={styles.text}>{c.thanhtien}</Text></Col>
                                    </Row>
                                )}
                            </Grid>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tổng giá trị:{Total}</Text>
                        </ScrollView>
                    </View >
                }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 60,
        width: '100%',
        backgroundColor: '#ffffff'
    }, textContent: {
        flex: 3,
        padding: 7,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        textAlign: 'center',
    }, cartImg: {
        width: 80,
        height: 60,
    },
    row:{
        marginBottom:7,
    },
    col:{
        padding:5
    },
    text:{
        textAlign:'center',

    }

})