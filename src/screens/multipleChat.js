import React, { Component } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, Image, FlatList, SafeAreaView } from 'react-native';
import ImageIcon from '../components/imageIcon';
import { Colors } from '../components/colors'
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../components/gradientButton';
import { Weekdays } from './homeStack/home'
import Icon from 'react-native-vector-icons/Entypo'
import DefaultLoader from '../components/defaultLoader'
import InfoPopup from '../components/infoPopup'

import { connect } from 'react-redux'
import { GET_PARTICIPANTS } from '../redux/trainerRedux'

const screenWidth = Dimensions.get('window').width

class MultipleChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      participants: [],
      errorTitle: '',
      errorMessage: '',
      errorModalVisible: false,
      id: '',
      activeDay: '',
      title: '',
      category: '',
      time: '',
      count: 0
    };
  }

  componentDidMount() {


  }

  render() {
    return (
      <SafeAreaView style={styles.parentContainer}>
        <View style={styles.parentContainer}>
        <DefaultLoader
          modalVisible={this.state.loading}
        />
        <InfoPopup
          title={this.state.errorTitle}
          subTitle={this.state.errorMessage}
          okButton={() => {
            this.setState({ errorModalVisible: false })
          }}
          setEqualSpace={15}
          modalVisible={this.state.errorModalVisible}
          okText="OK"
        />
        <FlatList
          ListHeaderComponent={
            <View style={{ marginBottom: 10 }}>
              <View style={styles.topBarContainer}>
                <View style={{ marginBottom: 50 }} >
                  <Text style={styles.username}>Chatrooms</Text>
                </View>
              </View>
            </View>

          }
          data={this.props.user.user.sessions}
          keyExtractor={item => item}
          renderItem={({ item }) => {

            var dt = new Date(this.props.user.sessions[item]['time'])
            var hours = dt.getHours()
            var minutes = dt.getMinutes()
            if (hours > 11) {
              if (minutes < 10) {
                dt = `${+hours - 12}:0${minutes} PM`
              }
              else {
                dt = `${+hours - 12}:${minutes} PM`
              }
            }
            else {
              if (minutes < 10) {
                dt = `${hours}:0${minutes} AM`
              }
              else {
                dt = `${hours}:${minutes} AM`
              }
            }

            // var lastMessageTime = new Date(this.props.user.sessions[item]['lastCreatedAt'])
            // var hours = lastMessageTime.getHours()
            // var minutes = lastMessageTime.getMinutes()
            // if (hours > 11) {
            //   if (minutes < 10) {
            //     lastMessageTime = `${+hours - 12}:0${minutes} PM`
            //   }
            //   else {
            //     lastMessageTime = `${+hours - 12}:${minutes} PM`
            //   }
            // }
            // else {
            //   if (minutes < 10) {
            //     lastMessageTime = `${hours}:0${minutes} AM`
            //   }
            //   else {
            //     lastMessageTime = `${hours}:${minutes} AM`
            //   }
            // }

            // var lastMessage = this.props.user.sessions[item]['lastMessage']

            // if(this.props.user.sessions[item]['lastMessage'].length > 10) {
            //   lastMessage = str.substring(0, 9) + '...'
            // }

            return (
              <Pressable onPress={() => {
                this.props.navigation.navigate('ChatHome', {id: item})
              }} >
                <View style={{ marginBottom: 15, flexDirection: 'row', marginHorizontal: 10, backgroundColor: 'black', paddingHorizontal: 10, paddingVertical: 10, borderColor: Colors.boxBorder, borderWidth: 2, borderRadius: 20, }}>
                  <View style={{ flex: 3, justifyContent: 'center', }} >
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '90%' }} >
                      <Text style={{ color: Colors.white, fontWeight: 'bold', alignSelf: 'center', fontSize: 20, }}>{this.props.user.sessions[item]['category']}</Text>
                      <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, marginTop: 15, marginBottom: 10 }}>⏲️ {dt}</Text>
                      {/* <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, marginTop: 15, marginBottom: 10 }}>🧘🏽‍♀️ {this.props.user.sessions[item]['filledSpots']}</Text> */}
                    </View>
                    <View style={{marginBottom: 3}}>
                      <Weekdays left={true} width={screenWidth * 0.63} activeDay={this.props.user.sessions[item]['activeDay']} />
                    </View>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' , width: '90%' , borderTopColor: Colors.boxBorder , borderWidth: 1 , marginTop: 3 }} >
                      {/* <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, marginTop: 15, marginBottom: 10 }}>{lastMessage}</Text> */}
                      {/* <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, marginTop: 15, marginBottom: 10 }}> {lastMessageTime}</Text> */}
                      { this.props.user.user.unread[item] > 0 && <Text style={{ color: Colors.gradientRight, fontWeight: 'bold', fontSize: 15, marginTop: 15, marginBottom: 10 }}> {this.props.user.user.unread[item]} unread</Text>}
                    </View>
                  </View>
                  <Icon size={20} name='chevron-thin-right' style={{ alignSelf: 'center', marginRight: 20 }} color={Colors.textPlaceholder} />
                </View>
              </Pressable>
            )

          }}
        />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return (
    {
      user: state.user,
      trainer: state.trainer
    }
  )
}
export default connect(mapStateToProps)(MultipleChat)

class TrainerProfile extends Component {
  render() {
    return (
      <Pressable onPress={this.props.onPress} style={styles.trainerContainer}>
        <View>
          <ImageIcon onPress={this.props.onPress} source={{ uri: this.props.profilePic }} height={0.25 * screenWidth} width={0.25 * screenWidth} borderRadius={0.125 * screenWidth} />
          <View style={styles.label}>
            <Text style={styles.labelText}>{this.props.type}</Text>
          </View>
        </View>
        <Text style={styles.trainerText}>{this.props.trainerName}</Text>
      </Pressable>
    )
  };
}
const styles = StyleSheet.create({
  parentContainer: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingHorizontal: 20
  },
  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between'
  },
  text: {
    color: Colors.white,
    fontSize: 20,
    marginTop: 10
  },
  username: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 30
  },
  topicText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.white,
    marginTop: 2,
    marginBottom: 20,
  },
  label: {
    backgroundColor: Colors.boxBackground,
    paddingHorizontal: 5,
    position: 'absolute',
    bottom: 0,
    left: -5,
    borderWidth: 2,
    borderColor: Colors.boxBorder,
    borderRadius: 10,
  },
  labelText: {
    color: Colors.textPlaceholder,
    fontWeight: 'bold'
  },
  trainerText: {
    fontWeight: 'bold',
    marginTop: 10,
    color: Colors.white,
  },
  trainerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
    marginRight: screenWidth * 0.05
  }
})
