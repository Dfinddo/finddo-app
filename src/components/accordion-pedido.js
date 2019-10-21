import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class Accordian extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      accordianClosed: true,
    }
  }

  render() {
    if (this.state.accordianClosed) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ width: 100, height: 100, backgroundColor: 'red' }}
            onPress={() => {
              console.log('toquei');
              this.setState({ accordianClosed: !this.state.accordianClosed })
            }}>
            <Text style={{ fontSize: 10 }}>Toque para abrir</Text>
          </TouchableOpacity>
          <View style={{ width: 100, height: 100, backgroundColor: 'green' }}></View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ width: 100, height: 100, backgroundColor: 'red' }}
            onPress={() => {
              console.log('toquei');
              this.setState({ accordianClosed: !this.state.accordianClosed })
            }}>
            <Text style={{ fontSize: 10 }}>Toque para abrir</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }

}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'darkgray',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  parentHr: {
    height: 1,
    color: 'white',
    width: '100%'
  },
  child: {
    backgroundColor: 'lightgray',
    padding: 16,
  }
});