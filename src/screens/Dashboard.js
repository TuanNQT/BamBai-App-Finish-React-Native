import React, { useEffect, useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  FlatList, ActivityIndicator, TextInput, SafeAreaView, RefreshControl
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import UserContext from '../helpers/UserData';
export default function Dashboard({ route, navigation }) {
  const { userId, username } = route.params ?? {};
  const { userIDcontext, userNamecontext } = useContext(UserContext);
  const [UserID] = userIDcontext;
  const [isLoading, setLoading] = useState(true);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataCate, setDataCate] = useState([]);
  const [dataparent, setdataparent] = useState([]);
  const [loadingCart, setisLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState("All");
  const [selectedValueUnit, setSelectedValueUnit] = useState("Filter By Unit Cost");
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // wait(2000).then(() => setRefreshing(false));
    try {
      getProducts();
    } catch (error) {
      return
    }finally{
      setRefreshing(false)
    }
  }, []);

  const getProducts = async () => {
    try {
      const response = await fetch('https://bambai.online/Admin/APIBamBai/Get_AllProduct');
      const json = await response.json();
      console.log(json);
      setDataProduct(json);
      setdataparent(json)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    fetch("https://bambai.online/Admin/APIBamBai/Get_AllCategory",)
      .then(response => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setDataCate(responseJson)
        setLoading(false);

      })
      .catch(error => console.log(error))
  }
  useEffect(() => {
    getProducts();
  }, []);
  const searchItem = (search) => {
    setLoading(true);
    // fetch("https://localhost:44393/Admin/APIBamBai/Get_ProductbySearchKey", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     search: search,
    //   })
    // }).then(response => response.json())
    //   .then((responseJson) => {
    //     setDataProduct(responseJson)
    //     setLoading(false)
    //   })
    //   .catch(error => console.log(error))
    setDataProduct(dataparent.filter(x => x.ModelName.includes(search) || x.ModelNumber.includes(search)))
    setLoading(false);
  }
  const ItembyUnit = (id) => {
    setLoading(true)
    if (id == 1) {
      setDataProduct(dataProduct.sort(function (a, b) {
        setLoading(false);
        return a.UnitCost - b.UnitCost
      }))
    }
    else if (id == 0) {
      setDataProduct(dataProduct.sort(function (a, b) {
        setLoading(false)
        return b.UnitCost - a.UnitCost
      }))
    }
  }
  const detailItem = (item, userId) => {
    navigation.navigate('DetailsItem', { item, userId })
  }
  const ItembyCatID = (id) => {
    setLoading(true)
    if (id == 0) {
      setDataProduct(dataparent);
      setLoading(false)
      return
    }
    let datacate = [];
    for (let i = 0; i < dataparent.length; i++) {
      if (dataparent[i].CategoryID == id) {
        datacate.push(dataparent[i]);
      }
    }
    console.log(datacate);
    setDataProduct(datacate);
    setLoading(false)
  }
  const addProductToCart = (id) => {
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
            console.log("C???p nh???t gi??? h??ng th??nh c??ng");
            Alert.alert(
              "Th??nh c??ng",
              "Gi??? h??ng ???? ???????c c???p nh???t",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ]
            );
          }
          if (responseJson.code == 200) {
            console.log("Th??m v??o gi??? h??ng th??nh c??ng");
            Alert.alert(
              "Th??nh c??ng",
              "???? th??m s???n ph???m v??o gi???",
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
            console.log("L???i g?? ????");
            Alert.alert(
              "L???i g?? ????..",
              "L???i th??m s???n ph???m v??o gi???!!",
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
      console.log("B???n ch??a ????ng nh???p")
      Alert.alert(
        "Error",
        "Vui l??ng ????ng nh???p ????? ti???p t???c",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "????ng nh???p ngay", onPress: () => navigation.navigate('LoginScreen') }
        ]
      );
    }
  }
  const renderItem = (item) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text numberOfLines={2} style={styles.title}>{item.ModelName}</Text>
            <Text style={styles.price}>{item.UnitCost}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => detailItem(item, userId)}>
          <Image style={styles.cardImage} source={{ uri: 'https://bambai.online/Content/images/items/' + item.ProductImage }} />
        </TouchableOpacity>
        <View style={styles.cardFooter}>
          {(loadingCart == true) ? <ActivityIndicator size="large" color="#0000ff" /> :
            <View style={styles.socialBarContainer}>
              <View style={styles.socialBarSection}>
                <TouchableOpacity style={styles.socialBarButton} onPress={() => addProductToCart(item.ProductID)}>
                  <Image style={styles.icon} source={{ uri: 'https://img.icons8.com/nolan/96/3498db/add-shopping-cart.png' }} />
                  <Text style={[styles.socialBarLabel, styles.buyNow]}>Th??m gi???</Text>
                </TouchableOpacity>

              </View>
            </View>
          }
        </View>

      </View>
    )
  }
  return (
    // <Background >
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ height: 200 }} behavior="padding">
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 20, marginTop: 30 }}>
          <View style={{ flex: 0.5, alignItems: 'baseline', }}>
            <TextInput style={styles.inputs}
              placeholder="T??? kh??a"
              underlineColorAndroid='transparent'
              onChangeText={(search) => {
                searchItem(search)
                setSelectedValue('All')
                setSelectedValueUnit('Filter By Unit Cost')
              }} />
          </View>
          <View style={{
            flex: 0.5,
            flexDirection: 'row',
            borderColor: 'black',
            borderRadius: 10,
          }}>
            <Picker style={styles.picker}
              mode={'dropdown'}  //'dialog' pop-up window'dropdown' drop down
              selectedValue={selectedValue}
              onValueChange={(value) => {
                ItembyCatID(value)
                // if (value == 'All') {
                //   getProducts()
                // }
                setSelectedValue(value)
              }}>
              <Picker.Item label={'T??m theo danh m???c'} value={0} />
              <Picker.Item label={'T???t c???'} value={0} />
              {dataCate.map((category) => <Picker.Item key={category.CategoryID} label={category.CategoryName} value={category.CategoryID} />)}

            </Picker>
            <Picker style={styles.picker}
              mode={'dropdown'}  //'dialog' pop-up window'dropdown' drop down
              selectedValue={selectedValueUnit}
              onValueChange={(value) => {
                ItembyUnit(value)
                setSelectedValueUnit(value)
              }}>
              <Picker.Item label={'T??m theo gi??'} value={1} />
              <Picker.Item label={'T??ng d???n'} value='1' />
              <Picker.Item label={'Gi???m d???n'} value='0' />

            </Picker>
          </View>


        </View>
      </SafeAreaView>
      <SafeAreaView style={{ height: 630 }} behavior="padding">
        <View style={{ flex: 2.5, marginBottom: 30 }}>
          {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> :
            <FlatList style={styles.list}
              data={dataProduct}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              contentContainerStyle={styles.listContainer}
              keyExtractor={(item) => item.ProductID}
              horizontal={false}
              numColumns={2}
              renderItem={({ item }) => renderItem(item)}
            />
          }
        </View>

      </SafeAreaView>
    </View>
    // </Background>
  )
}
const styles = StyleSheet.create({
  picker: {
    width: '50%',
  },
  container: {
    flex: 1,
    marginTop: 30,
  },
  inputs: {
    width: '97%',
    minHeight: 50,
    borderWidth: 1,
    borderColor: 'black',
    padding: 16,
    margin: 5,
    borderRadius: 20,
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: 'center'
  },
  navigationContainer: {
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: "center"
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor: "#E6E6E6",
  },
  listContainer: {
    alignItems: 'center'
  },
  separator: {
    marginTop: 10,
  },
  /******** card **************/
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    marginVertical: 8,
    backgroundColor: "white",
    flexBasis: '50%',
    marginHorizontal: 5,
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage: {
    flex: 1,
    height: 90,
    width: null,
  },
  /******** card components **************/
  title: {
    fontSize: 14,
    flex: 1,
  },
  price: {
    fontSize: 12,
    color: "green",
    marginTop: 5
  },
  buyNow: {
    color: "violet",
  },
  icon: {
    width: 25,
    height: 25,
  },
  /******** social bar ******************/
  socialBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  },
  socialBarSection: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  socialBarlabel: {
    marginLeft: 8,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  socialBarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
