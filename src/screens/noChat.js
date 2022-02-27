import React, { Component } from 'react';
import { View, Text , SafeAreaView } from 'react-native';
import {Colors} from '../components/colors'

class chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <SafeAreaView style={{
        flex:1,
        paddingHorizontal:20,
        backgroundColor:Colors.background,
        alignItems:'center',
        justifyContent:'center'
      }}>
        <Text style={{
          color: Colors.white,
          fontSize: 20,
        }}>
          You are currently
        </Text>
        <Text style={{
          color: Colors.white,
          fontSize: 20,
        }}>
          not part of
        </Text>
        <Text style={{
          color: Colors.white,
          fontSize: 20,
        }}>
          any session
        </Text>
        <Text style={{
          color: Colors.white,
          fontSize: 20,
          marginTop: 20
        }}>
          Join a session.
        </Text>
        <Text style={{
          color: Colors.white,
          fontSize: 20,
        }}>
          Lets get to work
        </Text>
        <Text style={{
          color: Colors.white,
          fontSize: 20,
        }}>
          💪🏽💪🏽💪🏽
        </Text>
      </SafeAreaView>
    );
  }
}

export default chat;
