import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'

export default class explore extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>explore Bawo</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        flex: 1
    }
})