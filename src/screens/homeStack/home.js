import React, { Component } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, Image, FlatList, SafeAreaView, TouchableOpacity, Platform, Linking } from 'react-native';
import { Colors } from '../../components/colors';
import ImageIcon from '../../components/imageIcon';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../../components/gradientButton';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Carousel from 'react-native-snap-carousel';
import DefaultLoader from '../../components/defaultLoader'
import InfoPopup from '../../components/infoPopup'
import Icon from 'react-native-vector-icons/Entypo'
import Toast from 'react-native-simple-toast';
const base64 = require('base-64')
import RazorpayCheckout from 'react-native-razorpay'
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux'
import { GET_USER, GET_HOME, GET_SESSION, REMOVE_MESSAGES, GET_UNREAD } from '../../redux/userRedux'
import { GET_TRAINER, GET_LISTENER } from '../../redux/trainerProfilesRedux';
import messaging from '@react-native-firebase/messaging'

const screenWidth = Dimensions.get('window').width
var navigationUnsubscribe
class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideshow: false,
      loading: true,
      errorTitle: '',
      errorMessage: '',
      errorModalVisible: false,
      firstSessions: false,
      iosPermission: false,
      isGroup: true
    };
  }

  getSessions = async (sessions) => {

    this.setState({ loading: true })

    // console.log("SESSIONS", sessions)

    fetch('https://us-central1-healer-fit-1.cloudfunctions.net/api/getSessions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessions: sessions,
      })
    })
      .then((res) => {

        // console.log("FIRST", res)

        return res.json()
      })
      .then((res) => {

        // console.log("RES", res , sessions)

        for (var i = 0; i < res.length; i += 1) {

          // console.log("RES III", res[i])

          this.props.dispatch({

            type: GET_SESSION,
            payload: {
              id: res[i].id,
              session: res[i]
            }

          })

          // console.log("DONEEE")

          this.setState({ loading: false })

        }
      })
      .catch((err) => {

        console.log("ERROR", err)

        this.setState({ loading: false })
        this.setState({ errorTitle: 'Error', errorMessage: 'We encountered a problem while fetching your sessions', errorModalVisible: true })

      })

  }

  async componentDidMount() {

    navigationUnsubscribe = this.props.navigation.addListener('focus', () => {
      // console.log('navigation', this.props.route.params.registered)
      if (this.props.route.params.registered) {
        this.props.navigation.setParams({ registered: false })
        this.setState({ errorTitle: 'Successfully Registered', errorMessage: 'You have been successfully registered', errorModalVisible: true })
      }
    })

    if (Platform.OS === 'ios') {

      var authStatus = await messaging().requestPermission()

      enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      if (enabled) {
        this.setState({ iosPermission: true })
      }

    }

    this.props.dispatch({
      type: REMOVE_MESSAGES
    })

    var uid = auth().currentUser.uid

    var userDocListener = firestore().collection('users').doc(uid).onSnapshot(doc => {

      this.props.dispatch({

        type: GET_USER,
        payload: doc.data()

      })

      if (doc.data().sessions.length === 1) {
        var key = doc.data()['sessions'][0]
        var unread = doc.data()['unread'][key]
        this.props.dispatch({
          type: GET_UNREAD,
          payload: unread
        })
      }
      else if (doc.data().sessions.length > 1) {

        var unread = 0

        for (var i = 0; i < doc.data()['sessions'].length; i += 1) {

          if (doc.data()['unread'][doc.data()['sessions'][i]] > 0) {
            unread += 1
          }

          this.props.dispatch({
            type: GET_UNREAD,
            payload: unread
          })

        }

      }

    })

    if (this.props.user.user.sessions.length === 0) {

      fetch('https://us-central1-healer-fit-1.cloudfunctions.net/api/home', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: auth().currentUser.uid,
        })
      })
        .then((res) => {

          return res.json()

        })
        .then((res) => {

          this.props.dispatch({
            type: GET_HOME,
            payload: res
          })

          this.setState({ loading: false })

        })
        .catch((err) => {

          // console.log("ERROR", err)

          this.setState({ loading: false })
          this.setState({ errorTitle: 'Error', errorMessage: 'Please try again', errorModalVisible: true })

        })

    }
    else if (this.props.user.user.sessions.length > 0 && !this.props.user.user.isTrainer) {

      await this.getSessions(this.props.user.user.sessions)

    }
    else if (this.props.user.user.sessions.length > 0 && this.props.user.user.isTrainer) {
      // console.log('*****Hello')
      var sessionsListener = firestore().collection('sessions').where('trainer', '==', uid)
        .onSnapshot(query => {

          query.forEach(doc => {

            var data = { ...doc.data(), id: doc.id }
            // console.log(data)
            this.props.dispatch({

              type: GET_SESSION,
              payload: {
                id: doc.id,
                session: data
              }

            })

          })

        })

      this.setState({ loading: false })

      this.props.dispatch({
        type: GET_LISTENER,
        payload: sessionsListener
      })

    }

    if (Platform.OS === 'android' || (Platform.OS === 'ios' && this.state.iosPermission)) {
      var token = await messaging().getToken()

      messaging().subscribeToTopic("all").catch()

      if (token !== this.props.user.user.token) {
        firestore().collection('users').doc(uid).update({
          token: token
        })
      }
    }

    this.props.dispatch({
      type: GET_LISTENER,
      payload: userDocListener
    })

  }

  async componentDidUpdate(prevProps, prevState) {

    if (JSON.stringify(this.props.user.user.sessions) !== JSON.stringify(prevProps.user.user.sessions)) {

      // console.log("YEAH", prevProps.user.user.sessions , this.props.user.user.sessions)

      if (this.props.user.user.sessions.length > 0) {

        // if(prevProps.user.user.sessions.length === 0 && this.state.firstSessions) {

        //   await this.getSessions(this.props.user.user.sessions)

        // }
        // else if (prevProps.user.user.sessions.length > 0) {

        await this.getSessions(this.props.user.user.sessions)

        for (var j = 0; j < this.props.user.user.sessions.length; j += 1) {

          if (Platform.OS === 'android' || (Platform.OS === 'ios' && this.state.iosPermission)) {

            messaging().subscribeToTopic(this.props.user.user.sessions[j]).catch()

            if (j === 0) {

              messaging().subscribeToTopic('all').catch()

            }

          }

        }

        // }

      }
    }
  }

  componentWillUnmount() {
    navigationUnsubscribe()
    for (var i = 0; i < this.props.trainerProfiles.listener; i += 1) {

      try {
        this.props.trainerProfiles.listener[i]()
      } catch (error) {

      }

    }

  }

  _renderItem = ({ item, index }) => {
    return (
      // <View style={{ width: screenWidth * 0.6, height: 150 }}>
      <FastImage style={{ borderRadius: 25, width: screenWidth * 0.6, height: 200, alignSelf: 'center' }} source={{ uri: item }} />
      // </View>
    );
  }

  renewSession = async (currency, cost, title, sessionId, trainer, linkedAccount, transferRatio) => {

    // console.log("RENEW")

    this.setState({ loading: true })

    fetch(`https://api.razorpay.com/v1/orders`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64.encode('rzp_live_RGmSMq7cIoDFDR:90cuaJxnCzdao4dN4uhKuHSF')}`

      }),
      body: JSON.stringify({
        amount: cost * 100,
        currency: currency,
        payment: {
          capture: "automatic",
          capture_options: {
            refund_speed: "normal"
          }
        },
        transfers: [
          {
            account: linkedAccount,
            amount: cost * 100 * transferRatio,
            currency: currency,
            notes: {
              [this.props.user.user.name]: '1',
              [this.props.user.user.email]: '1'
            },
            linked_account_notes: [this.props.user.user.name, this.props.user.user.email]
          },
        ]
      })
    })
      .then((res) => {
        return res.json()
      })
      .then((payment) => {

        this.setState({ loading: false })

        var options = {
          description: 'Kalzi Membership',
          image: 'https://i.imgur.com/4u1aCXb.jpg',
          currency: 'INR',
          key: 'rzp_live_RGmSMq7cIoDFDR', // Your api key
          amount: cost * 100,
          name: title,
          prefill: {
            email: this.props.user.user.email,
            name: this.props.user.user.name
          },
          order_id: payment.id,
          theme: { color: Colors.facebookBlue },
        }

        RazorpayCheckout.open(options).then((razorpayData) => {

          this.setState({ loading: true })

          var date = new Date().getTime()
          var uid = auth().currentUser.uid

          firestore().collection('users').doc(uid).update({
            [`transactions.${sessionId}.${date}`]: razorpayData.razorpay_payment_id,
          })

          fetch('https://us-central1-healer-fit-1.cloudfunctions.net/api/renewSession', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              uid: auth().currentUser.uid,
              sessionId: sessionId,
              task: this.props.user.user.expiry[sessionId]['task'],
              time: this.props.user.user.expiry[sessionId]['expiry'],
              trainer: trainer,
              name: this.props.user.user.name
            })
          })
            .then((info) => {
              return info.text()
            })
            .then((info) => {

              this.setState({ loading: false })

              if (info === 'Failure') {
                this.setState({ errorTitle: 'Error', errorMessage: 'Please reach out to us if error persists', errorModalVisible: true })
              }
              else {
                Toast.showWithGravity('Succesfully renewed', Toast.LONG, Toast.CENTER);
              }

            })
            .catch(err => {
              this.setState({ loading: false })
              this.setState({ errorTitle: 'Error', errorMessage: 'Please reach out to us if error persists', errorModalVisible: true })
            })

        }).catch((error) => {
          // console.log("Razorpay Error", error)
          this.setState({ loading: false })
        })
      })
      .catch(() => {
        this.setState({ loading: false })
        this.setState({ errorTitle: 'Error', errorMessage: 'Please try again', errorModalVisible: true })
      })

  }

  render() {

    // console.log("PROPS", this.props.user.sessions)

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

          {this.props.user.user.sessions.length === 0 &&
            <FlatList
              data={this.props.user.home.trainers}
              numColumns={3}
              ListHeaderComponent={
                <View>
                  <View style={styles.topBarContainer}>
                    <View style={{ marginBottom: 20 }} >
                      <Text style={styles.text}>Hey, </Text>
                      <Text style={styles.username}>{this.props.user.user.name} </Text>
                    </View>
                    {this.props.user.user.photoUrl !== '' && <ImageIcon source={{ uri: this.props.user.user.photoUrl }} height={70} width={70} borderRadius={35} />}
                  </View>
                  {/* <View style={{ alignItems: 'center' }} >
                    <Carousel
                      style={{ alignSelf: 'center', justifyContent: 'center' }}
                      ref={(c) => { this.carousel = c; }}
                      data={this.props.user.home.slideshow}
                      // keyExtractor={item => item}
                      renderItem={this._renderItem}
                      sliderWidth={screenWidth}
                      itemWidth={screenWidth * 0.6}
                    />
                  </View> */}
                  <Text style={styles.topicText}>Available Trainers</Text>
                </View>
              }
              keyExtractor={item => item}
              renderItem={({ item }) => {
                return (
                  <TrainerProfile key={item.uid} onPress={() => this.props.navigation.navigate("TrainerProfile", { uid: item.uid })} profilePic={item.photoUrl} type={item.category} trainerName={item.name} />
                )
              }}
            />
          }
          {this.props.user.user.sessions.length > 0 &&
            <FlatList
              data={this.props.user.user.sessions}
              // style={{ borderColor: 'red', borderWidth: 1 }}
              numColumns={3}
              ListHeaderComponent={
                <View>
                  <View style={styles.topBarContainer}>
                    <View style={{ marginBottom: 20 }} >
                      <Text style={styles.text}>Hey, </Text>
                      <Text style={styles.username}>{this.props.user.user.name} </Text>
                    </View>
                    <ImageIcon source={{ uri: this.props.user.user.photoUrl }} height={70} width={70} borderRadius={35} />
                  </View>
                  <View style={{ flexDirection: "row" }} width={200}>

                    {this.props.user.user.isTrainer &&

                      <View style={{ marginBottom: 30, marginLeft: 12, flexDirection: "row", alignItems: "center" }} >




                        <GradientButton flex={10} flexDirection={"column"} height={40} width={screenWidth * 0.37} borderRadius={15} text='Group'
                          onPress={() => {
                            this.setState({ isGroup: true });

                          }}


                        />



                      </View>
                    }

                    {this.props.user.user.isTrainer &&

                      <View style={{ flex: 0.9 }} >
                        <GradientButton height={40} width={screenWidth * 0.37} borderRadius={15} text='Personal'
                          onPress={() => {
                            this.setState({ isGroup: false });


                          }}


                        />











                      </View>

                    }





                  </View>
                  <View style={{ alignItems: 'center' }} >
                  </View>
                  {/* <Text style={styles.topicText}>Available Trainers</Text> */}
                </View>
              }
              keyExtractor={item => item}
              renderItem={({ item }) => {
                if (this.props.user.sessions[item] !== undefined) {
                  var date = new Date().getTime()
                  var expiry = false
                  var left = (this.props.user.user.expiry[item].expiry - date) / (24 * 60 * 60 * 1000)
                  left = Math.floor(left)
                  if (left <= 5) {
                    expiry = true
                  }
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
                    if (hours < 10) {
                      if (minutes < 10) {
                        dt = `0${hours}:0${minutes} AM`
                      }
                      else {
                        dt = `0${hours}:${minutes} AM`
                      }
                    }
                  }
                  return (
                    <View style={{ flex: 1, alignItems: 'center' }} >


                      {this.state.isGroup == true ? (<React.Fragment>
                        <ScrollView
                          horizontal={true}
                        >


                          <View style={{ marginTop: 25, width: screenWidth * 0.63, backgroundColor: Colors.boxBackground, paddingVertical: 20, borderColor: Colors.boxBorder, borderWidth: 2, borderRadius: 20, alignItems: 'center' }}>
                            <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 25 }}>{this.props.user.sessions[item].title}</Text>
                            {!this.props.user.user.isTrainer && <Text style={{ color: Colors.gradientLeft, fontWeight: 'bold', fontSize: 15 }}>{this.props.user.sessions[item].trainerName} <Text style={{ color: Colors.gradientRight, fontWeight: 'bold', fontSize: 15 }}>{this.props.user.sessions[item].category}</Text></Text>}
                            {this.props.user.user.isTrainer && <Text style={{ color: Colors.gradientLeft, fontWeight: 'bold', fontSize: 15 }}>{this.props.user.sessions[item].category}</Text>}
                            <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, marginTop: 10, marginBottom: 10 }}>⏲️ Time: {dt}</Text>
                            <Weekdays width={screenWidth * 0.63} activeDay={this.props.user.sessions[item].activeDay} style={{ alignSelf: 'center', width: screenWidth * 0.63 }} />
                            <View style={{ backgroundColor: Colors.background, borderColor: Colors.boxBorder, borderWidth: 2, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10, marginVertical: 20 }}>
                              {!this.props.user.user.isTrainer && <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Expires in <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15 }}> {left} days</Text></Text>}
                              {this.props.user.user.isTrainer &&
                                <TouchableOpacity onPress={() => {
                                  this.props.navigation.navigate('ViewParticipants', {
                                    id: item, activeDay: this.props.user.sessions[item].activeDay,
                                    title: this.props.user.sessions[item].title,
                                    time: `⏲️ Time: ${dt}`,
                                    category: this.props.user.sessions[item].title
                                  })
                                }} >
                                  <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>🧘🏽 <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15 }}>View Participants</Text></Text>
                                </TouchableOpacity>
                              }
                            </View>
                            {!this.props.user.user.isTrainer && expiry &&
                              <TouchableOpacity
                                onPress={async () => {
                                  // console.log("YESH")
                                  await this.renewSession(
                                    this.props.user.sessions[item].currency,
                                    this.props.user.sessions[item].cost,
                                    this.props.user.sessions[item].title,
                                    item,
                                    this.props.user.sessions[item].trainer,
                                    this.props.user.sessions[item].linkedAccount,
                                    this.props.user.sessions[item].transferRatio
                                  )
                                }}
                              >
                                <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, alignSelf: 'center', marginBottom: 10 }}>
                                  ⚠️ Click Here to Renew
                                </Text>
                              </TouchableOpacity>
                            }
                            <GradientButton
                              height={40}
                              width="95%"
                              borderRadius={20}
                              onPress={async () => {
                                try {
                                  // console.log("URL", this.props.user.sessions[item].zoomUrl)
                                  var supported = await Linking.canOpenURL(this.props.user.sessions[item].zoomUrl)
                                  if (supported) {
                                    Linking.openURL(this.props.user.sessions[item].zoomUrl)
                                  }
                                  else {
                                    this.setState({ errorTitle: 'Whoops', errorMessage: `Don't know how to open this URL`, errorModalVisible: true })
                                  }
                                } catch (error) {
                                  console.log("ERROR", error)
                                  this.setState({ errorTitle: 'Success', errorMessage: `Attendance marked`, errorModalVisible: true })
                                }
                              }}
                              text="START"
                            />
                            {/* <View style={{marginTop: 15 , flex: 1}} > */}
                            <GradientButton
                              height={40}
                              width="95%"
                              borderRadius={20}
                              onPress={() => {
                                this.props.navigation.navigate('WebView', { url: this.props.user.sessions[item].instructionUrl })
                              }}
                              text="MORE INFO"
                              style={{ marginTop: 20 }}
                              border={true}
                            />
                          </View>
                        </ScrollView>
                      </React.Fragment>
                      ) : (

                        <React.Fragment>
                          <View style={{ marginBottom: 15, flexDirection: 'row', marginHorizontal: 10, backgroundColor: 'black', paddingHorizontal: 10, paddingVertical: 10, borderColor: Colors.boxBorder, borderWidth: 2, borderRadius: 20, }}>
                            <ImageIcon onPress={this.props.onPress} source={{ uri: item.photoUrl }} height={45} width={45} borderRadius={22.5} />
                            {/*{item.injury === '' && <Text style={{ color: 'green', fontWeight: 'bold', alignSelf: 'center', marginLeft: 35, fontSize: 25, flex: 3 }}>Name 1</Text>}
                          {item.injury !== '' && <Text style={{ color: 'red', fontWeight: 'bold', alignSelf: 'center', marginLeft: 35, fontSize: 25, flex: 3 }}>Name 1</Text>}*/}
                            {<Text style={{ color: 'green', fontWeight: 'bold', alignSelf: 'center', marginLeft: 35, fontSize: 25, flex: 3 }}>Name 1</Text>}
                            <Icon size={20} name='chevron-thin-right' style={{ alignSelf: 'center', marginRight: 20 }} color={Colors.textPlaceholder} />



                          </View>

                          <View style={{ marginBottom: 15, flexDirection: 'row', marginHorizontal: 10, backgroundColor: 'black', paddingHorizontal: 10, paddingVertical: 10, borderColor: Colors.boxBorder, borderWidth: 2, borderRadius: 20, }}>
                            <ImageIcon onPress={this.props.onPress} source={{ uri: item.photoUrl }} height={45} width={45} borderRadius={22.5} />
                            {/*{item.injury === '' && <Text style={{ color: 'green', fontWeight: 'bold', alignSelf: 'center', marginLeft: 35, fontSize: 25, flex: 3 }}>Name 2</Text>}
                          {item.injury !== '' && <Text style={{ color: 'red', fontWeight: 'bold', alignSelf: 'center', marginLeft: 35, fontSize: 25, flex: 3 }}>Name 2</Text>}*/}
                            {<Text style={{ color: 'green', fontWeight: 'bold', alignSelf: 'center', marginLeft: 35, fontSize: 25, flex: 3 }}>Name 2</Text>}
                            <Icon size={20} name='chevron-thin-right' style={{ alignSelf: 'center', marginRight: 20 }} color={Colors.textPlaceholder} />



                          </View>
                        </React.Fragment>

                      )
                      }


                    </View>
                  )
                }
                return null
              }}
            />
          }
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return (
    {
      user: state.user,
      trainerProfiles: state.trainerProfiles
    }
  )
}
export default connect(mapStateToProps)(home)

export class Weekdays extends Component {
  render() {
    if (this.props.left === undefined) {
      return (
        <View style={{ width: this.props.width, }}>
          <View style={{
            flexDirection: 'row',
            backgroundColor: Colors.background,
            paddingVertical: 5,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%', alignSelf: 'center'
          }}>
            {this.props.activeDay.includes("M") ? <ActiveDay day="M" /> : <InactiveDay day="M" />}
            {this.props.activeDay.includes("T") ? <ActiveDay day="T" /> : <InactiveDay day="T" />}
            {this.props.activeDay.includes("W") ? <ActiveDay day="W" /> : <InactiveDay day="W" />}
            {this.props.activeDay.includes("Th") ? <ActiveDay day="Th" /> : <InactiveDay day="Th" />}
            {this.props.activeDay.includes("F") ? <ActiveDay day="F" /> : <InactiveDay day="F" />}
            {this.props.activeDay.includes("S") ? <ActiveDay day="S" /> : <InactiveDay day="S" />}
            {this.props.activeDay.includes("Su") ? <ActiveDay day="Su" /> : <InactiveDay day="Su" />}
          </View>
        </View>
      )
    }
    else {
      return (
        <View style={{ width: this.props.width, }}>
          <View style={{
            flexDirection: 'row',
            backgroundColor: Colors.background,
            paddingVertical: 5,
            borderRadius: 30,
            // justifyContent: 'center',
            width: '90%',
          }}>
            {this.props.activeDay.includes("M") ? <ActiveDay day="M" /> : <InactiveDay day="M" />}
            {this.props.activeDay.includes("T") ? <ActiveDay day="T" /> : <InactiveDay day="T" />}
            {this.props.activeDay.includes("W") ? <ActiveDay day="W" /> : <InactiveDay day="W" />}
            {this.props.activeDay.includes("Th") ? <ActiveDay day="Th" /> : <InactiveDay day="Th" />}
            {this.props.activeDay.includes("F") ? <ActiveDay day="F" /> : <InactiveDay day="F" />}
            {this.props.activeDay.includes("S") ? <ActiveDay day="S" /> : <InactiveDay day="S" />}
            {this.props.activeDay.includes("Su") ? <ActiveDay day="Su" /> : <InactiveDay day="Su" />}
          </View>
        </View>
      )
    }
  };
}
class ActiveDay extends Component {
  render() {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[Colors.gradientLeft, Colors.gradientRight]}
        style={[
          {
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 8,
            paddingVertical: 5,
            marginRight: 7
          },
        ]}>
        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 10 }}>{this.props.day}</Text>
      </LinearGradient>
    )
  };
}
class InactiveDay extends Component {
  render() {
    return (
      <View style={{
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 5,
        marginRight: 7
      }}>
        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 10 }}>{this.props.day}</Text>
      </View>
    )
  };
}
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
    paddingHorizontal: 20,
    // alignItems: 'center'
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
    fontSize: 25,
    color: Colors.white,
    marginTop: 25,
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
    marginHorizontal: (screenWidth * 0.25 - 40) / 6,
    // marginHorizontal: 10
    // marginLeft: 10
  }
})
