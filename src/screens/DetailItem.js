import React, { Component, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import BackButton from '../components/BackButton'
import Background from '../components/Background';
import UserContext from '../helpers/UserData'
import { useContext } from 'react'
export default function DetailsItem({ route, navigation }) {
    const { userIDcontext, userNamecontext } = useContext(UserContext);
    const [UserID] = userIDcontext;
    const [isLoading, setisLoading] = useState(false)
    const addtoCart = (id) => {
        if (UserID != 0) {
            setisLoading(true)
            fetch("https://bambai.online/Admin/APIBamBai/addCart", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    soluong: 1,
                    id: id,
                    cusid: UserID,
                })
            }).then(response => response.json())
                .then((responseJson) => {
                    setisLoading(false)
                    console.log(responseJson);
                    if (responseJson.code == 250) {
                        console.log("Cập nhật giỏ hàng thành công");
                        Alert.alert(
                            "Thành công",
                            "Giỏ hàng đã được cập nhật",
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                { text: "OK", onPress: () => console.log("OK Pressed") }
                            ]
                        );
                    }
                    if (responseJson.code == 200) {
                        console.log("Thêm vào giỏ hàng thành công");
                        Alert.alert(
                            "Thành công",
                            "Sản phẩm đã được thêm vào giỏ",
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                { text: "OK", onPress: () => console.log("OK Pressed") }
                            ]
                        );

                    }
                    if (responseJson.code == 500) {
                        console.log("Lỗi gì đó");
                        Alert.alert(
                            "Lỗi gì đó...",
                            "Sản phẩm chưa được thêm!!",
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                { text: "OK", onPress: () => console.log("OK Pressed") }
                            ]
                        );
                    }
                }).catch(error => console.log(error));
        } else {
            console.log("Bạn chưa đăng nhập")
            Alert.alert(
                "Error",
                "Vui lòng đăng nhập để tiếp tục",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => navigation.navigate('LoginScreen') }
                ]
            );
        }

    }
    const { item, userId } = route.params ?? {}
    console.log(item);
    console.log(UserID)
    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <View style={styles.container}>
                <ScrollView style={{flex:1}}>
                    <View style={{ alignItems: 'center', marginHorizontal: 30 }}>
                        <Image style={styles.productImg} source={{ uri: 'https://bambai.online/Content/images/items/' + item.ProductImage }} />
                        <Text style={styles.name}>{item.ModelName}</Text>
                        <Text style={styles.price}>{item.UnitCost}</Text>
                        <Text style={styles.description}>
                            {item.Description}
                        </Text>
                    </View>
                    <View style={styles.starContainer}>
                        <Image style={styles.star} source={{ uri: "https://img.icons8.com/color/40/000000/star.png" }} />
                        <Image style={styles.star} source={{ uri: "https://img.icons8.com/color/40/000000/star.png" }} />
                        <Image style={styles.star} source={{ uri: "https://img.icons8.com/color/40/000000/star.png" }} />
                        <Image style={styles.star} source={{ uri: "https://img.icons8.com/color/40/000000/star.png" }} />
                        <Image style={styles.star} source={{ uri: "https://img.icons8.com/color/40/000000/star.png" }} />
                    </View>
                    <View style={styles.contentColors}>
                        <TouchableOpacity style={[styles.btnColor, { backgroundColor: "#00BFFF" }]}></TouchableOpacity>
                        <TouchableOpacity style={[styles.btnColor, { backgroundColor: "#FF1493" }]}></TouchableOpacity>
                        <TouchableOpacity style={[styles.btnColor, { backgroundColor: "#00CED1" }]}></TouchableOpacity>
                        <TouchableOpacity style={[styles.btnColor, { backgroundColor: "#228B22" }]}></TouchableOpacity>
                        <TouchableOpacity style={[styles.btnColor, { backgroundColor: "#20B2AA" }]}></TouchableOpacity>
                        <TouchableOpacity style={[styles.btnColor, { backgroundColor: "#FF4500" }]}></TouchableOpacity>
                    </View>
                    <View style={styles.contentSize}>
                        <TouchableOpacity style={styles.btnSize}><Text>S</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.btnSize}><Text>M</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.btnSize}><Text>L</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.btnSize}><Text>XL</Text></TouchableOpacity>
                    </View>
                    <View style={styles.separator}></View>
                    {isLoading == true ? <ActivityIndicator size="large" color="#0000ff" /> :
                        <View style={styles.addToCarContainer}>
                            <TouchableOpacity style={styles.shareButton} onPress={() => addtoCart(item.ProductID)}>
                                <Text style={styles.shareButtonText}>Thêm vào giỏ</Text>
                            </TouchableOpacity>
                        </View>
                    }

                </ScrollView>
            </View>
        </Background>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
    productImg: {
        width: 200,
        height: 200,
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: 'bold'
    },
    price: {
        marginTop: 10,
        fontSize: 18,
        color: "green",
        fontWeight: 'bold'
    },
    description: {
        textAlign: 'center',
        marginTop: 10,
        color: "#696969",
    },
    star: {
        width: 40,
        height: 40,
    },
    btnColor: {
        height: 30,
        width: 30,
        borderRadius: 30,
        marginHorizontal: 3
    },
    btnSize: {
        height: 40,
        width: 40,
        borderRadius: 40,
        borderColor: '#778899',
        borderWidth: 1,
        marginHorizontal: 3,
        backgroundColor: 'white',

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    starContainer: {
        justifyContent: 'center',
        marginHorizontal: 30,
        flexDirection: 'row',
        marginTop: 20
    },
    contentColors: {
        justifyContent: 'center',
        marginHorizontal: 30,
        flexDirection: 'row',
        marginTop: 20
    },
    contentSize: {
        justifyContent: 'center',
        marginHorizontal: 30,
        flexDirection: 'row',
        marginTop: 20
    },
    separator: {
        height: 2,
        backgroundColor: "#eeeeee",
        marginTop: 20,
        marginHorizontal: 30
    },
    shareButton: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: "#00BFFF",
    },
    shareButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
    },
    addToCarContainer: {
        marginHorizontal: 30
    }
});