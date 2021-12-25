import UserContext from '../helpers/UserData'
import React, { useContext, useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/core'
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native'
import { DataTable } from 'react-native-paper'
import BackButton from '../components/BackButton'
import { Col, Row, Grid } from 'react-native-easy-grid'
export default function OrderHistory({ route, navigation }) {
  const { userIDcontext, userNamecontext } = useContext(UserContext)
  const [UserID, setUserID] = userIDcontext
  const [UserName, setUserName] = userNamecontext
  const [dataOrder, setdataOrder] = useState([])
  const isFocused = useIsFocused()
  const [isLoading, setisLoading] = useState(false)
  const ConvertJsonDateToDate = (date) => {
    var parsedDate = new Date(parseInt(date.substr(6)))
    var newDate = new Date(parsedDate)
    var month = ('0' + (newDate.getMonth() + 1)).slice(-2)
    var day = ('0' + newDate.getDate()).slice(-2)
    var year = newDate.getFullYear()
    return day + '/' + month + '/' + year
  }
  const getOrderHistory = () => {
    if (UserID != 0) {
      setisLoading(true)
      fetch('https://bambai.online/Admin/APIBamBai/viewOrder', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: UserID,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          for (var i = 0; i < responseJson.order.length; i++) {
            // Loop through each property in the Array.
            for (var property in responseJson.order[i]) {
              if (responseJson.order[i].hasOwnProperty(property)) {
                var resx = /Date\(([^)]+)\)/
                // Checking Date with regular expresion.
                if (resx.test(responseJson.order[i][property])) {
                  // Setting Date in dd/MM/yyyy format.
                  responseJson.order[i][property] = ConvertJsonDateToDate(
                    responseJson.order[i][property]
                  )
                }
              }
            }
          }
          setisLoading(false)
          console.log(responseJson)
          if (responseJson.code == 200) {
            setdataOrder(responseJson.order)
          }
        })
        .catch((error) => console.log(error))
    }
  }
  useEffect(() => {
    if (isFocused) {
      getOrderHistory()
    }
  }, [isFocused])
  const DetailOrder = (OrderID) => {
    navigation.navigate('DetailsOrder', { OrderID })
  }
  return (
    <View style={{ width: '100%', flex: 1 }}>
      <BackButton goBack={navigation.goBack} />
      {isLoading ? (
        <ActivityIndicator
          style={{ padding: 100 }}
          size="large"
          color="#0000ff"
        />
      ) : (
        <View style={styles.container}>
          <ScrollView style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                justifyContent: 'center',
              }}
            >
              Lịch sử đặt hàng
            </Text>
            <Grid>
              <Row>
                <Col style={styles.col} size={32}>
                  <Text style={styles.textcol}>Ngày đặt</Text>
                </Col>
                <Col style={styles.col} size={30}>
                  <Text style={styles.textcol}>Ngày giao{'\n'}(Dự kiến)</Text>
                </Col>
                <Col style={styles.col} size={20}>
                  <Text style={styles.textcol}>Trạng thái</Text>
                </Col>
                <Col style={styles.col} size={15}>
                  <Text style={styles.textcol}>Chức năng</Text>
                </Col>
              </Row>
              {dataOrder.map((c) => (
                <Row key={c.OrderID}>
                  <Col style={styles.col} size={32}>
                    <Text style={styles.textcol}>{c.OrderDate}</Text>
                  </Col>
                  <Col style={styles.col} size={35}>
                    <Text style={styles.textcol}>{c.ShipDate}</Text>
                  </Col>
                  <Col style={styles.col} size={20}>
                    {c.status ? (
                      <Text style={styles.textcol}>Hoàn thành</Text>
                    ) : (
                      <Text style={styles.textcol}>Chờ xác nhận</Text>
                    )}
                  </Col>
                  <Col style={styles.col} size={15}>
                    <TouchableOpacity
                      style={{ marginLeft: 8 }}
                      onPress={() => DetailOrder(c.OrderID)}
                    >
                      <Image
                        style={{ width: 15, height: 15 }}
                        source={{
                          uri: 'https://image.flaticon.com/icons/png/512/1/1755.png',
                        }}
                      />
                    </TouchableOpacity>
                  </Col>
                </Row>
              ))}
            </Grid>
          </ScrollView>
        </View>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    width: '100%',
    paddingTop: 40,
    backgroundColor: '#ffffff',
  },
  textContent: {
    flex: 3,
    padding: 7,
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    textAlign: 'center',
  },
  col: {
    padding: 5,
  },
  textcol: {
    fontSize: 13,
  },
})
