import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'

export default class explore extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>explore</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        alignItems: 'center',
        flex: 1
    }
})