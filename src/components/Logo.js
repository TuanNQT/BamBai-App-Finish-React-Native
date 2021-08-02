import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image source={{uri: "https://bambai.online/Content/images/logo.png"}} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 55,
    marginBottom: 15,
  },
})
