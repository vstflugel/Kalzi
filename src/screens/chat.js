import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Modal,
  Pressable
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../components/colors';
import { TextInputField } from './login';
import { connect } from 'react-redux'
import GradientButton from '../components/gradientButton';
import Popup from '../components/defaultPopup'
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth'
import InfoPopup from '../components/infoPopup'
import storage from '@react-native-firebase/storage'
import DefaultLoader from '../components/defaultLoader'
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Fontisto'
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image'
import Svg, { Path } from 'react-native-svg';
import firestore from '@react-native-firebase/firestore'
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values'

import {
  GET_INITIAL_MESSAGES, GET_REALTIME_MESSAGES, GET_MORE_MESSAGES,
  REMOVE_SPECIFIC_MESSAGE, ADD_IMAGE_LOADING, REMOVE_IMAGE_LOADING,
  HIDE_MESSAGE, ADD_BLOCK
} from '../redux/userRedux'

import { GET_LISTENER } from '../redux/trainerProfilesRedux'

const screenWidth = Dimensions.get('window').width

class Chat extends Component {
  constructor(props) {
    super(props);

    var idHere

    try {
      if (this.props.route.params.id !== undefined) {
        idHere = this.props.route.params.id
        // console.log("ID HERE", idHere)
      }
    } catch (error) {
      idHere = this.props.user.user.sessions[0]
    }

    this.state = {

      exitPopup: false,
      errorTitle: '',
      errorMessage: '',
      errorModalVisible: false,
      listenStart: undefined,
      message: '',
      loading: false,
      uri: '',
      id: idHere,
      uid: auth().currentUser.uid,
      title: '',
      category: '',
      getError: false,
      reportPopup: false,
      selectedUser: '',
      selectedMessage: '',
      reportTextPopup: false,
      reportText: ''

    };
  }

  componentDidMount() {

    // console.log("********************************************************", this.state.id)

    if (this.state.id !== undefined) {

      this.setState({
        title: this.props.user.sessions[this.state.id].title,
        category: this.props.user.sessions[this.state.id].category,
      })

      if (this.props.user.messages[this.state.id] === undefined) {
        var lim = 15
        this.getInitialMessages(this.state.id, lim)
      }

      this.clearUnread()

    }
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevState.listenStart !== this.state.listenStart) {
      // console.log("LISTEN START", this.state.listenStart, prevState.listenStart)
      this.getRealtimeMessages(this.state.id, this.state.listenStart)
    }

  }

  componentWillUnmount() {
    this.clearUnread()
  }

  clearUnread() {
    firestore().collection('users').doc(this.state.uid).update({
      [`unread.${this.state.id}`]: 0
    })
      .catch(err => {
      })
  }

  getInitialMessages(id, limit) {
    // console.log("GET INITIAL MESSAGES")
    this.setState({ loading: true })
    firestore().collection('sessions')
      .doc(`${id}`).collection('messages')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()
      .then((query) => {
        var chats = []
        query.forEach((doc) => {
          var d = { id: doc.id }
          d = { ...doc.data(), ...d }
          chats.push(d)
        })
        this.props.dispatch({
          type: GET_INITIAL_MESSAGES,
          payload: {
            data: chats,
            sessionId: id
          }
        })
        this.setState({ listenStart: chats[0]['createdAt'] })
        this.setState({ loading: false })
      })
      .catch(err => {
        this.setState({ getError: true })
        this.setState({ loading: false })
      })
  }

  getRealtimeMessages(id, start) {
    // console.log("START", start)
    var chatUnsubscribe = firestore().collection('sessions')
      .doc(`${id}`)
      .collection('messages')
      .orderBy('createdAt')
      .startAfter(start)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {

            if (change.doc.data().type === 'text' && change.doc.data().senderUid !== this.state.uid) {

              var d = { id: change.doc.id }
              d = { ...d, ...change.doc.data() }
              this.props.dispatch({
                type: GET_REALTIME_MESSAGES,
                payload: {
                  sessionId: id,
                  data: d
                }
              })

            }

            else if (change.doc.data().type === 'image') {

              if (change.doc.data().senderUid !== this.state.uid) {

                var d = { id: change.doc.id }
                d = { ...d, ...change.doc.data() }
                this.props.dispatch({
                  type: GET_REALTIME_MESSAGES,
                  payload: {
                    sessionId: id,
                    data: d
                  }
                })
              }
              else {
                this.props.dispatch({
                  type: REMOVE_IMAGE_LOADING,
                  payload: {
                    id: change.doc.id
                  }
                })
              }
            }
          }
        })
      }, err => {
        Alert.alert('GET REALTIME MESSAGES ERROR', 'There was an error while fetching reatime messages. Please close the app and open it again.')
      })

    this.props.dispatch({
      type: GET_LISTENER,
      payload: chatUnsubscribe
    })
  }

  getMoreMessages(id) {
    firestore().collection('sessions')
      .doc(`${id}`).collection('messages')
      .orderBy('createdAt', 'desc')
      .startAfter(this.props.user.messages[id][this.props.user.messages[id].length - 1]['createdAt'])
      .limit(10)
      .get()
      .then((query) => {
        var chats = []
        query.forEach((doc) => {
          var d = { id: doc.id }
          d = { ...d, ...doc.data() }
          chats.push(d)
        })
        this.props.dispatch({
          type: GET_MORE_MESSAGES,
          payload: {
            data: chats,
            sessionId: id
          }
        })
      })
      .catch(() => {
        Alert.alert(
          "Error",
          "Could not fetch previous messages. Please check your internet connection"
        )
      })
  }

  sendMessage = (data, id, date) => {

    firestore().collection('sessions')
      .doc(`${this.state.id}`)
      .collection('messages')
      .doc(id)
      .set({
        senderUid: this.state.uid,
        sender: this.props.user.user.name,
        content: data,
        createdAt: date,
        type: 'text'
      })
      .then((doc) => {
        // this.setUnread()
        this.setLast(data)
      })
      .catch((err) => {
        Alert.alert('SEND MESSAGE ERROR', 'There was an error while sending the message')
      })
  }

  setLast = (message) => {

    firestore().collection('sessions').doc(this.state.id).update({

      lastMessage: message,
      lastCreatedAt: new Date().toISOString()

    })

  }

  sendImage = (data, height, width, id) => {

    // console.log("IN SEND IMAGE", data)

    var date = new Date().toISOString()

    firestore().collection('sessions')
      .doc(`${this.state.id}`)
      .collection('messages')
      .doc(id)
      .set({
        senderUid: this.state.uid,
        sender: this.props.user.user.name,
        content: data,
        createdAt: date,
        type: 'image',
        height: height,
        width: width
      })
      .then((doc) => {
        // this.setUnread()
        this.setLast('📷')
      })
      .catch((err) => {
        Alert.alert('SEND IMAGE ERROR', 'There was an error while sending the image')
      })

  }

  camera = async () => {

    ImagePicker.openCamera({
      useFrontCamera: true
    })
      .then(async (image) => {

        var imageId = uuidv4()

        var uploadUri = Platform.OS === 'ios' ? image['path'].replace('file://', '') : image['path']
        var date = new Date().toISOString()

        var data = {
          senderUid: this.state.uid,
          sender: this.props.user.user.name,
          content: uploadUri,
          createdAt: date,
          type: 'image',
          height: image['height'],
          width: image['width'],
          id: imageId
        }

        this.props.dispatch({
          type: GET_REALTIME_MESSAGES,
          payload: {
            sessionId: this.state.id,
            data: data
          }
        })

        this.props.dispatch({
          type: ADD_IMAGE_LOADING,
          payload: {
            id: imageId
          }
        })

        try {

          await storage().ref(`chat/${this.state.id}/${this.state.uid}/${imageId}`).putFile(uploadUri)

          var uri = await storage().ref(`chat/${this.state.id}/${this.state.uid}/${imageId}`).getDownloadURL()

          this.sendImage(uri, image['height'], image['width'], imageId)

        } catch (error) {

          this.props.dispatch({
            type: REMOVE_SPECIFIC_MESSAGE,
            payload: {
              sessionId: this.state.id,
              messageId: imageId
            }
          })

          Alert.alert(
            "Error",
            "There was an error uploading the image. Please Try again"
          )
        }

      }
      )
      .catch(err => { })
  }

  file = async () => {

    ImagePicker.openPicker({
      mediaType: 'photo'
    })
      .then(async (image) => {

        var imageId = uuidv4()

        var uploadUri = Platform.OS === 'ios' ? image['path'].replace('file://', '') : image['path']
        var date = new Date().toISOString()

        var data = {
          senderUid: this.state.uid,
          sender: this.props.user.user.name,
          content: uploadUri,
          createdAt: date,
          type: 'image',
          height: image['height'],
          width: image['width'],
          id: imageId
        }

        this.props.dispatch({
          type: GET_REALTIME_MESSAGES,
          payload: {
            sessionId: this.state.id,
            data: data
          }
        })

        this.props.dispatch({
          type: ADD_IMAGE_LOADING,
          payload: {
            id: imageId
          }
        })

        try {

          await storage().ref(`chat/${this.state.id}/${this.state.uid}/${imageId}`).putFile(uploadUri)

          var uri = await storage().ref(`chat/${this.state.id}/${this.state.uid}/${imageId}`).getDownloadURL()

          this.sendImage(uri, image['height'], image['width'], imageId)

        } catch (error) {

          this.props.dispatch({
            type: REMOVE_SPECIFIC_MESSAGE,
            payload: {
              sessionId: this.state.id,
              messageId: imageId
            }
          })

          Alert.alert(
            "Error",
            "There was an error uploading the image. Please Try again"
          )
        }

      }
      )
      .catch(err => { })

  }

  render() {
    if(Platform.OS === 'android') {
      return (
        <SafeAreaView style={styles.rootContainer}>
          <KeyboardAvoidingView style={styles.rootContainer} >
          <DefaultLoader
            modalVisible={this.state.loading}
          />
          <Popup
            title="Select Image"
            subTitle=""
            cancelButton={async () => {
  
              await this.file()
              this.setState({ exitPopup: false })
  
            }}
            okButton={async () => {
  
              await this.camera()
              this.setState({ exitPopup: false })
  
            }}
            closeButton={() => {
              this.setState({ exitPopup: false })
            }}
            setEqualSpace={15}
            modalVisible={this.state.exitPopup}
            okText="📷"
            cancelText="From Files"
          />
  
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.reportPopup}
            onRequestClose={() => {
              this.setState({ reportPopup: false })
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  width: 300,
                  backgroundColor: Colors.boxBackground,
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginRight: 10,
                    marginLeft: 15,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{ color: '#4068e5', fontSize: 20, fontWeight: 'bold' }}>
                    Options
                    </Text>
                  <TouchableOpacity
                    style={{
                      borderWidth: 2,
                      borderColor: '#4068e5',
                      height: 30,
                      width: 30,
                      borderRadius: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                    onPress={() => {
                      this.setState({ reportPopup: false })
                    }}>
                    <FontAwesome name="close" size={15} color="#4068e5" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={async () => {
  
                    this.props.dispatch({
                      type: ADD_BLOCK,
                      payload: {
                        user: this.state.selectedUser
                      }
                    })
  
                    this.setState({ reportPopup: false })
                  }}
                  style={{
                    marginTop: 10,
                    borderTopColor: 'rgba(191,191,191,0.2)',
                    borderTopWidth: 2,
                    borderBottomColor: 'rgba(191,191,191,0.2)',
                    borderBottomWidth: 2,
                    paddingVertical: 10,
                  }}>
                  <Text style={{ color: 'red', alignSelf: 'center' }}>
                    Block
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  paddingVertical: 10, borderTopColor: 'rgba(191,191,191,0.2)',
                }}
                  onPress={() => {
                    this.props.dispatch({
                      type: ADD_BLOCK,
                      payload: {
                        user: this.state.selectedUser
                      }
                    })
  
                    this.setState({ reportPopup: false })
                  }}
                >
                  <Text style={{ color: 'orange', alignSelf: 'center' }}>
                    Report Inappropriate
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  paddingVertical: 10, borderTopColor: 'rgba(191,191,191,0.2)',
                  borderTopWidth: 2,
                  borderBottomColor: 'rgba(191,191,191,0.2)',
                  // borderBottomWidth: 2,
                  paddingVertical: 10,
                }}
                  onPress={() => {
                    // console.log("HIDE")
                    this.props.dispatch({
                      type: HIDE_MESSAGE,
                      payload: {
                        sessionId: this.state.id,
                        messageId: this.state.selectedMessage
                      }
                    })
  
                    this.setState({ reportPopup: false })
                  }}
                >
                  <Text style={{ color: '#7f7f7f', alignSelf: 'center' }}>
                    Hide
                    </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
  
          <View style={styles.topBar}>
            <Feather
              name="chevron-left"
              size={40}
              color={Colors.textPlaceholder}
              style={styles.backButton}
              onPress={() => this.props.navigation.goBack()}
            />
            <View style={styles.blobText}>
              <Text style={styles.signUp}>{this.state.title}</Text>
              <Text style={styles.signUpCaption}>{this.state.category}</Text>
            </View>
          </View>
          { this.props.user.messages[this.state.id] !== undefined &&
            <FlatList
              style={{ marginBottom: 60, marginTop: 15 }}
              keyExtractor={item => item.id}
              initialNumToRender={10}
              inverted={true}
              keyExtractor={item => item.id}
              data={this.props.user.messages[this.state.id]}
              showsVerticalScrollIndicator={false}
              windowSize={5}
              onEndReachedThreshold={0.25}
              onEndReached={(distance) => {
                this.getMoreMessages(this.state.id)
              }}
              renderItem={({ item }) => {
  
                // console.log("ITEM ID", item.id)
  
                if (this.props.user.blocked[item.senderUid] === undefined && (this.props.user.hiddenMessages[this.state.id] === undefined || (this.props.user.hiddenMessages[this.state.id] !== undefined && this.props.user.hiddenMessages[this.state.id][item.id] === undefined))) {
  
                  var dt = new Date(item.createdAt)
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
                    if(hours < 10) {
  
                      if (minutes < 10) {
                        dt = `0${hours}:0${minutes} AM`
                      }
                      else {
                        dt = `0${hours}:${minutes} AM`
                      }
  
                    }
                  }
  
                  if (item.type === 'text' && item.senderUid === this.state.uid) {
                    return (
                      <OutgoingMsg
                        uname='You'
                        message={item.content}
                        time={dt}
                      />
                    )
                  }
                  else if (item.type === 'text' && item.senderUid !== this.state.uid) {
                    return (
                      <Pressable
                      onLongPress={() => {
                        this.setState({
                          selectedMessage: item.id,
                          selectedUser: item.senderUid,
                          reportPopup: true
                        })
                      }}
                      >
                        <IncomingMsg
                          name={item.sender}
                          message={item.content}
                          time={dt}
                        />
                      </Pressable>
                    )
                  }
  
                  else if (item.type === 'image' && item.senderUid === this.state.uid) {
  
                    if (this.props.user.imageLoading[item.id] !== undefined) {
  
                      return (
                        <OutgoingImg
                          loading={true}
                          username={'You'}
                          time={dt}
                          content={item.content}
                        />
                      )
                    }
                    else {
                      return (
                        <OutgoingImg
                          loading={false}
                          name={'You'}
                          time={dt}
                          content={item.content}
                        />
                      )
                    }
                  }
                  else if (item.type === 'image' && item.senderUid !== this.state.uid) {
                    return (
                      <Pressable onLongPress={() => {
  
                        this.setState({
                          selectedMessage: item.id,
                          selectedUser: item.senderUid,
                          reportPopup: true
                        })
  
                      }} >
                        <IncomingImg
                          name={item.sender}
                          time={dt}
                          content={item.content}
                        />
                      </Pressable>
                    )
                  }
                }
              }}
            />}
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              position: 'absolute',
              bottom: 5,
              backgroundColor: 'black',
            }}>
            {/* <Box height={50} width={0.8 * screenWidth} borderRadius={25}> */}
            <View
              style={{
                height: 50,
                width: 0.8 * screenWidth,
                backgroundColor: Colors.boxBackground,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: Colors.boxBorder,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TextInput
                keyboardAppearance='dark'
                multiline={true}
                maxLength={500}
                placeholder="Type to send a message..."
                placeholderTextColor={Colors.textPlaceholder}
                style={{
                  fontWeight: 'bold',
                  paddingHorizontal: 20,
                  width: '80%',
                  color: Colors.white
                }}
                onChangeText={(text) => {
                  this.setState({ message: text })
                }}
                value={this.state.message}
              />
              {/* Here on press this should navigate to create zap screen. */}
              <Icon
                onPress={() => {
                  this.setState({ exitPopup: true })
                }}
                name="photograph"
                color={Colors.textPlaceholder}
                size={20}
                style={{ marginLeft: 28 }}
              />
            </View>
            <TouchableOpacity
              style={{ alignItems: 'center', alignSelf: 'center', justifyContent: 'center', marginLeft: 1 }}
              onPress={() => {
                if (this.state.message !== '') {
                  var id = uuidv4()
                  var date = new Date().toISOString()
                  this.sendMessage(this.state.message, id, date)
                  var data = {
                    senderUid: this.state.uid,
                    sender: this.props.user.user.name,
                    content: this.state.message,
                    createdAt: date,
                    type: 'text',
                    id: id
                  }
                  this.setState({ message: '' })
  
                  this.props.dispatch({
                    type: GET_REALTIME_MESSAGES,
                    payload: {
                      sessionId: this.state.id,
                      data: data
                    }
                  })
                }
              }}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[Colors.gradientLeft, Colors.gradientRight]}
                style={{
                  height: 40,
                  borderRadius: 20,
                  width: 40,
                  borderWidth: 1,
                  borderColor: Colors.boxBorder,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Feather
                  // Use using send message logic here. ....(1)
                  name="feather"
                  color="#fff"
                  size={20}
                  style={{ alignSelf: 'center' }}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
        </SafeAreaView >
      );
    } else if (Platform.OS === 'ios') {
      return (
        <SafeAreaView style={styles.rootContainer}>
          <KeyboardAvoidingView style={styles.rootContainer} behavior='height' keyboardVerticalOffset={60} >
          <DefaultLoader
            modalVisible={this.state.loading}
          />
          <Popup
            title="Select Image"
            subTitle=""
            cancelButton={async () => {
  
              await this.file()
              this.setState({ exitPopup: false })
  
            }}
            okButton={async () => {
  
              await this.camera()
              this.setState({ exitPopup: false })
  
            }}
            closeButton={() => {
              this.setState({ exitPopup: false })
            }}
            setEqualSpace={15}
            modalVisible={this.state.exitPopup}
            okText="📷"
            cancelText="From Files"
          />
  
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.reportPopup}
            onRequestClose={() => {
              this.setState({ reportPopup: false })
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  width: 300,
                  backgroundColor: Colors.boxBackground,
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginRight: 10,
                    marginLeft: 15,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{ color: '#4068e5', fontSize: 20, fontWeight: 'bold' }}>
                    Options
                    </Text>
                  <TouchableOpacity
                    style={{
                      borderWidth: 2,
                      borderColor: '#4068e5',
                      height: 30,
                      width: 30,
                      borderRadius: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                    onPress={() => {
                      this.setState({ reportPopup: false })
                    }}>
                    <FontAwesome name="close" size={15} color="#4068e5" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={async () => {
  
                    this.props.dispatch({
                      type: ADD_BLOCK,
                      payload: {
                        user: this.state.selectedUser
                      }
                    })
  
                    this.setState({ reportPopup: false })
                  }}
                  style={{
                    marginTop: 10,
                    borderTopColor: 'rgba(191,191,191,0.2)',
                    borderTopWidth: 2,
                    borderBottomColor: 'rgba(191,191,191,0.2)',
                    borderBottomWidth: 2,
                    paddingVertical: 10,
                  }}>
                  <Text style={{ color: 'red', alignSelf: 'center' }}>
                    Block
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  paddingVertical: 10, borderTopColor: 'rgba(191,191,191,0.2)',
                }}
                  onPress={() => {
                    this.props.dispatch({
                      type: ADD_BLOCK,
                      payload: {
                        user: this.state.selectedUser
                      }
                    })
  
                    this.setState({ reportPopup: false })
                  }}
                >
                  <Text style={{ color: 'orange', alignSelf: 'center' }}>
                    Report Inappropriate
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  paddingVertical: 10, borderTopColor: 'rgba(191,191,191,0.2)',
                  borderTopWidth: 2,
                  borderBottomColor: 'rgba(191,191,191,0.2)',
                  // borderBottomWidth: 2,
                  paddingVertical: 10,
                }}
                  onPress={() => {
                    // console.log("HIDE")
                    this.props.dispatch({
                      type: HIDE_MESSAGE,
                      payload: {
                        sessionId: this.state.id,
                        messageId: this.state.selectedMessage
                      }
                    })
  
                    this.setState({ reportPopup: false })
                  }}
                >
                  <Text style={{ color: '#7f7f7f', alignSelf: 'center' }}>
                    Hide
                    </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
  
          <View style={styles.topBar}>
            <Feather
              name="chevron-left"
              size={40}
              color={Colors.textPlaceholder}
              style={styles.backButton}
              onPress={() => this.props.navigation.goBack()}
            />
            <View style={styles.blobText}>
              <Text style={styles.signUp}>{this.state.title}</Text>
              <Text style={styles.signUpCaption}>{this.state.category}</Text>
            </View>
          </View>
          { this.props.user.messages[this.state.id] !== undefined &&
            <FlatList
              style={{ marginBottom: 60, marginTop: 15 }}
              keyExtractor={item => item.id}
              initialNumToRender={10}
              inverted={true}
              keyExtractor={item => item.id}
              data={this.props.user.messages[this.state.id]}
              showsVerticalScrollIndicator={false}
              windowSize={5}
              onEndReachedThreshold={0.25}
              onEndReached={(distance) => {
                this.getMoreMessages(this.state.id)
              }}
              renderItem={({ item }) => {
  
                // console.log("ITEM ID", item.id)
  
                if (this.props.user.blocked[item.senderUid] === undefined && (this.props.user.hiddenMessages[this.state.id] === undefined || (this.props.user.hiddenMessages[this.state.id] !== undefined && this.props.user.hiddenMessages[this.state.id][item.id] === undefined))) {
  
                  var dt = new Date(item.createdAt)
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
                    if(hours < 10) {
  
                      if (minutes < 10) {
                        dt = `0${hours}:0${minutes} AM`
                      }
                      else {
                        dt = `0${hours}:${minutes} AM`
                      }
  
                    }
                  }
  
                  if (item.type === 'text' && item.senderUid === this.state.uid) {
                    return (
                      <OutgoingMsg
                        uname='You'
                        message={item.content}
                        time={dt}
                      />
                    )
                  }
                  else if (item.type === 'text' && item.senderUid !== this.state.uid) {
                    return (
                      <Pressable
                      onLongPress={() => {
                        this.setState({
                          selectedMessage: item.id,
                          selectedUser: item.senderUid,
                          reportPopup: true
                        })
                      }}
                      >
                        <IncomingMsg
                          name={item.sender}
                          message={item.content}
                          time={dt}
                        />
                      </Pressable>
                    )
                  }
  
                  else if (item.type === 'image' && item.senderUid === this.state.uid) {
  
                    if (this.props.user.imageLoading[item.id] !== undefined) {
  
                      return (
                        <OutgoingImg
                          loading={true}
                          username={'You'}
                          time={dt}
                          content={item.content}
                        />
                      )
                    }
                    else {
                      return (
                        <OutgoingImg
                          loading={false}
                          name={'You'}
                          time={dt}
                          content={item.content}
                        />
                      )
                    }
                  }
                  else if (item.type === 'image' && item.senderUid !== this.state.uid) {
                    return (
                      <Pressable onLongPress={() => {
  
                        this.setState({
                          selectedMessage: item.id,
                          selectedUser: item.senderUid,
                          reportPopup: true
                        })
  
                      }} >
                        <IncomingImg
                          name={item.sender}
                          time={dt}
                          content={item.content}
                        />
                      </Pressable>
                    )
                  }
                }
              }}
            />}
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              position: 'absolute',
              bottom: 5,
              backgroundColor: 'black',
            }}>
            {/* <Box height={50} width={0.8 * screenWidth} borderRadius={25}> */}
            <View
              style={{
                height: 50,
                width: 0.8 * screenWidth,
                backgroundColor: Colors.boxBackground,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: Colors.boxBorder,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TextInput
                keyboardAppearance='dark'
                multiline={true}
                maxLength={500}
                placeholder="Type to send a message..."
                placeholderTextColor={Colors.textPlaceholder}
                style={{
                  fontWeight: 'bold',
                  paddingHorizontal: 20,
                  width: '80%',
                  color: Colors.white
                }}
                onChangeText={(text) => {
                  this.setState({ message: text })
                }}
                value={this.state.message}
              />
              {/* Here on press this should navigate to create zap screen. */}
              <Icon
                onPress={() => {
                  this.setState({ exitPopup: true })
                }}
                name="photograph"
                color={Colors.textPlaceholder}
                size={20}
                style={{ marginLeft: 28 }}
              />
            </View>
            <TouchableOpacity
              style={{ alignItems: 'center', alignSelf: 'center', justifyContent: 'center', marginLeft: 1 }}
              onPress={() => {
                if (this.state.message !== '') {
                  var id = uuidv4()
                  var date = new Date().toISOString()
                  this.sendMessage(this.state.message, id, date)
                  var data = {
                    senderUid: this.state.uid,
                    sender: this.props.user.user.name,
                    content: this.state.message,
                    createdAt: date,
                    type: 'text',
                    id: id
                  }
                  this.setState({ message: '' })
  
                  this.props.dispatch({
                    type: GET_REALTIME_MESSAGES,
                    payload: {
                      sessionId: this.state.id,
                      data: data
                    }
                  })
                }
              }}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[Colors.gradientLeft, Colors.gradientRight]}
                style={{
                  height: 40,
                  borderRadius: 20,
                  width: 40,
                  borderWidth: 1,
                  borderColor: Colors.boxBorder,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Feather
                  // Use using send message logic here. ....(1)
                  name="feather"
                  color="#fff"
                  size={20}
                  style={{ alignSelf: 'center' }}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
        </SafeAreaView >
      );
    }
  }
}

const mapStateToProps = state => {
  return (
    {
      user: state.user,
    }
  )
}
export default connect(mapStateToProps)(Chat)


export class ChatDate extends Component {
  render() {
    return (
      <View style={{ alignSelf: 'center', marginTop: 10 }}>
        <Text
          style={{
            paddingVertical: 2,
            paddingHorizontal: 8,
            alignSelf: 'flex-start',
            backgroundColor: '#bebebe',
            borderRadius: 20,
            fontWeight: 'bold',
            color: '#fff',
            fontSize: 10,
          }}>
          {this.props.chatDate}
        </Text>
      </View>
    );
  }
}

// This is the messgage incoming component, The Pink One, and has the following props:
// 1. username: A String, use 'You' for example.
// 2. message: A string, the message.
// 3. time: A string, the time.
// 4. navigateToProfile: A function, on pressing the username you need to navigate the user to the messagers profile.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// YOU DONT HAVE TO MEDDLE WITH THE BELOW WRITTEN CODE JUST FOLLOW ABOVE INSTRUCTIONS.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export class IncomingMsg extends Component {
  render() {
    return (
      <View style={{ marginTop: 10 }} >
        <View
          style={{
            backgroundColor: Colors.chatBackground,
            marginLeft: 15,
            maxWidth: 270,
            alignSelf: 'flex-start',
            paddingHorizontal: 15,
            paddingTop: 5,
            paddingBottom: 7,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: Colors.gradientLeft, fontWeight: 'bold' }}>
            {this.props.name}
          </Text>
          <Text style={{ color: '#f2f2f2' }}>{this.props.message}</Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              fontSize: 10,
              opacity: 0.4,
              color: '#fff',
            }}>
            {this.props.time}
          </Text>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: [{ rotateX: '180deg' }],
              zIndex: -1,
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            }}>
            <Svg
              style={{ left: -6 }}
              width={15.5}
              height={17.5}
              viewBox="32.484 17.5 15.515 17.5"
              enable-background="new 32.485 17.5 15.515 17.5">
              <Path
                d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                fill={Colors.chatBackground}
                x="0"
                y="0"
              />
            </Svg>
          </View>
        </View>
      </View>
    );
  }
}
// This is the messgage outgoing component, The Blue One, and has the following props:
// 1. username: A String, use 'You' for example.
// 2. message: A string, the message.
// 3. time: A string, the time.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// YOU DONT HAVE TO MEDDLE WITH THE BELOW WRITTEN CODE JUST FOLLOW ABOVE INSTRUCTIONS.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export class OutgoingMsg extends Component {
  render() {
    return (
      <View style={{ alignSelf: 'flex-end', marginRight: 15, marginTop: 10 }}>
        <View
          style={{
            backgroundColor: Colors.boxBackground,
            maxWidth: 250,
            alignSelf: 'flex-start',
            paddingHorizontal: 15,
            paddingBottom: 10,
            paddingTop: 5,
            paddingBottom: 7,
            borderRadius: 20,
          }}>
          <Text style={{ color: Colors.gradientRight, fontWeight: 'bold' }}>
            {this.props.name}
          </Text>
          <Text style={{ color: 'white' }}>{this.props.message}</Text>
          <Text
            style={{
              alignSelf: 'flex-end',
              fontSize: 10,
              opacity: 0.4,
              color: '#fff',
            }}>
            {this.props.time}
          </Text>
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              transform: [{ rotateX: '180deg' }],
              zIndex: -1,
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
            <Svg
              style={{ right: -6 }}
              width={15.5}
              height={17.5}
              viewBox="32.485 17.5 15.515 17.5"
              enable-background="new 32.485 17.5 15.515 17.5">
              <Path
                d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                fill={Colors.boxBackground}
                x="0"
                y="0"
              />
            </Svg>
          </View>
        </View>
      </View>
    );
  }
}

export class IncomingImg extends Component {
  render() {
    return (
      //
      <View style={{ marginTop: 10 }} >
        <View
          style={{
            backgroundColor: Colors.chatBackground,
            marginLeft: 15,
            maxWidth: 250,
            alignSelf: 'flex-start',
            paddingHorizontal: 15,
            paddingTop: 5,
            paddingBottom: 10,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: Colors.gradientLeft, fontWeight: 'bold' }}>
            {this.props.name}
          </Text>
          <FastImage source={{ uri: this.props.content }}
            style={{ height: 200, width: 200, borderRadius: 20 }}
          />
          <Text
            style={{
              alignSelf: 'flex-end',
              fontSize: 10,
              opacity: 0.4,
              color: '#fff',
              paddingTop: 5
            }}>
            {this.props.time}
          </Text>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: [{ rotateX: '180deg' }],
              zIndex: -1,
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            }}>
            <Svg
              style={{ left: -6 }}
              width={15.5}
              height={17.5}
              viewBox="32.484 17.5 15.515 17.5"
              enable-background="new 32.485 17.5 15.515 17.5">
              <Path
                d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                fill={Colors.chatBackground}
                x="0"
                y="0"
              />
            </Svg>
          </View>
        </View>
      </View>
    );
  }
}

export class OutgoingImg extends Component {
  render() {
    // console.log("LOADING", this.props.loading)
    return (
      <View style={{ alignSelf: 'flex-end', marginRight: 15, marginTop: 10 }}>
        <View
          style={{
            backgroundColor: Colors.boxBackground,
            maxWidth: 250,
            alignSelf: 'flex-start',
            paddingHorizontal: 15,
            paddingBottom: 10,
            paddingTop: 5,
            borderRadius: 20,
          }}>
          <Text style={{ color: Colors.gradientRight, fontWeight: 'bold', paddingBottom: 4 }}>
            {this.props.name}
          </Text>
          <FastImage source={{ uri: this.props.content }}
            style={{ height: 200, width: 200, borderRadius: 20 }}
          />
          {this.props.loading &&
            <ActivityIndicator size='large' color={Colors.gradientLeft} style={{ position: 'absolute', marginTop: 110, marginLeft: 100 }} />
          }
          <Text
            style={{
              alignSelf: 'flex-end',
              fontSize: 10,
              opacity: 0.4,
              color: '#fff',
              paddingTop: 5
            }}>
            {this.props.time}
          </Text>
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              transform: [{ rotateX: '180deg' }],
              zIndex: -1,
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
            <Svg
              style={{ right: -6 }}
              width={15.5}
              height={17.5}
              viewBox="32.485 17.5 15.515 17.5"
              enable-background="new 32.485 17.5 15.515 17.5">
              <Path
                d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                fill={Colors.boxBackground}
                x="0"
                y="0"
              />
            </Svg>
          </View>
        </View>
      </View>
    );
  }
}


export class DoneBar extends Component {
  render() {
    return (
      <View style={{ width: '100%' }}>
        {!this.props.hideInfo && (
          <View
            style={{
              marginRight: 20,
              marginLeft: 15,
              marginBottom: 5,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="info" color={Colors.textPlaceholder} size={18} />
              <Text
                style={{
                  color: Colors.textPlaceholder,
                  marginLeft: 5,
                  fontSize: 16,
                }}>
                Info :
              </Text>
            </View>
            <Text
              style={{
                color: Colors.textPlaceholder,
                marginLeft: 5,
                marginTop: 2,
              }}>
              {this.props.infoText}
            </Text>
          </View>
        )}
        <View
          style={{
            backgroundColor: Colors.boxBackground,
            alignItems: 'center',
            paddingTop: 10,
            paddingBottom: 10,
            width: '100%',
          }}>
          <GradientButton
            height={40}
            width={screenWidth * 0.75}
            borderRadius={5}
            text={this.props.text || 'NEXT'}
            onPress={this.props.onPress}
          />
        </View>
      </View>
    );
  }
}

class EditTextField extends Component {
  render() {
    return (
      <TextInputField
        placeholder={this.props.placeholder}
        width="80%"
        error={this.props.error}
        errorBorder={this.props.error}
        iconAvailable={true}
        errorMessage="Search query must be atleast 3 words."
        onChangeText={this.props.onChangeText}
        onSubmitEditing={this.props.submitButton}
        style={this.props.style}>
        <FontAwesome
          name="edit"
          color={Colors.textPlaceholder}
          size={20}
          style={{ position: 'absolute', top: 13, right: 15 }}
        />
      </TextInputField>
    );
  }
}



const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    // paddingBottom: 60,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: { marginTop: 15, marginLeft: 15 },
  blob: {
    height: 250,
    width: '70%',
    resizeMode: 'contain',
    marginTop: -100,
    marginRight: -40,
  },
  blobText: {
    position: 'absolute',
    top: 15,
    right: 15,
    alignItems: 'flex-end',
  },
  signUp: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: Colors.white,
  },
  signUpCaption: {
    fontSize: 10,
    color: Colors.white,
  },
  gradientButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  dontHave: {
    color: Colors.textPlaceholder,
    alignSelf: 'center',
    marginTop: 10,
  },
  logIn: {
    color: Colors.error,
    fontFamily: 'Roboto-Bold',
  },
  or: {
    color: Colors.textPlaceholder,
    alignSelf: 'center',
    marginVertical: 30,
  },

});
