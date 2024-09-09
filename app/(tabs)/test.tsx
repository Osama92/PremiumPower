import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'

export default class test extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Test</Text>
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