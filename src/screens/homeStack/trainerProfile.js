import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Colors} from '../../components/colors';
import ImageIcon from '../../components/imageIcon';
import {Weekdays} from './home';
import GradientButton from '../../components/gradientButton';
import ReadMore from 'react-native-read-more-text';
import DefaultLoader from '../../components/defaultLoader';
import InfoPopup from '../../components/infoPopup';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import RazorpayCheckout from 'react-native-razorpay';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';
const base64 = require('base-64');

import {connect} from 'react-redux';
import {GET_TRAINER} from '../../redux/trainerProfilesRedux';

const screenWidth = Dimensions.get('window').width;

class trainerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      photoUrl: '',
      name: '',
      bio: '',
      sessions: [],
      uid: this.props.route.params.uid,
      errorTitle: '',
      errorMessage: '',
      errorModalVisible: false,
    };
  }

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text
        style={{color: Colors.facebookBlue, marginTop: 5}}
        onPress={handlePress}>
        Read more
      </Text>
    );
  };

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text
        style={{color: Colors.facebookBlue, marginTop: 5}}
        onPress={handlePress}>
        Show less
      </Text>
    );
  };

  register = async (
    currency,
    cost,
    title,
    sessionId,
    trainer,
    linkedAccount,
    transferRatio,
  ) => {
    try {
      var razorpayOrder = await fetch(`https://api.razorpay.com/v1/orders`, {
        method: 'POST',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${base64.encode(
            'rzp_live_RGmSMq7cIoDFDR:90cuaJxnCzdao4dN4uhKuHSF',
          )}`,
        }),
        body: JSON.stringify({
          amount: cost * 100,
          currency: currency,
        }),
      });
      razorpayOrder = await razorpayOrder.json();

      var options = {
        description: 'Kalzi Membership',
        image: 'https://i.imgur.com/4u1aCXb.jpg',
        currency: currency,
        key: 'rzp_live_RGmSMq7cIoDFDR', // Your api key
        amount: cost * 100,
        name: title,
        order_id: razorpayOrder.id,
        prefill: {
          email: this.props.user.user.email,
          name: this.props.user.user.name,
        },
        theme: {color: Colors.facebookBlue},
      };
      console.log(options);
      RazorpayCheckout.open(options)
        .then(async (razorpayData) => {
          // console.log('<<<<',razorpayData)
          this.setState({loading: true});

          var date = new Date().getTime();
          // var expiry = new Date(new Date().getTime() + 30 * 60 * 60 * 24 * 1000).toISOString()
          var uid = auth().currentUser.uid;

          firestore()
            .collection('users')
            .doc(uid)
            .update({
              [`transactions.${sessionId}.${date}`]: razorpayData.razorpay_payment_id,

              // [`expiry.${sessionId}`]: {
              //   expiry: expiry
              // }
            });

          try {
            var razorpayTransfer = await fetch(
              `https://api.razorpay.com/v1/payments/${razorpayData.razorpay_payment_id}/transfers`,
              {
                method: 'POST',
                headers: new Headers({
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Basic ${base64.encode(
                    'rzp_live_RGmSMq7cIoDFDR:90cuaJxnCzdao4dN4uhKuHSF',
                  )}`,
                }),
                body: JSON.stringify({
                  transfers: [
                    {
                      account: linkedAccount,
                      // amount: cost*100*transferRatio,
                      amount: cost * 100 * transferRatio,
                      currency: currency,
                      notes: {
                        [this.props.user.user.name]: '1',
                        [this.props.user.user.email]: '1',
                      },
                      linked_account_notes: [
                        this.props.user.user.name,
                        this.props.user.user.email,
                      ],
                    },
                  ],
                }),
              },
            );

            razorpayTransfer = await razorpayTransfer.json();
            console.log(razorpayTransfer);
          } catch (error) {}

          try {
            var userJoinSession = await fetch(
              'https://us-central1-healer-fit-1.cloudfunctions.net/api/joinSession',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  uid: uid,
                  sessionId: sessionId,
                  trainer: trainer,
                  name: this.props.user.user.name,
                }),
              },
            );
            // userJoinSession = await userJoinSession.text()
            this.setState({loading: false});
            // Toast.showWithGravity('Succesfully registered', Toast.LONG , Toast.CENTER);
            // this.setState({ errorTitle: 'Successfully registered', errorMessage: 'Please click home button to navigate to see session details', errorModalVisible: true })
            this.props.navigation.navigate('Sessions', {registered: true});
          } catch (error) {
            this.setState({loading: false});
            this.setState({
              errorTitle: 'Error',
              errorMessage: 'Please reach out to us if error persists',
              errorModalVisible: true,
            });
          }
        })
        .catch((error) => {
          this.setState({loading: false});
        });
    } catch (error) {}

    // var options = {
    //   description: 'Kalzi Membership',
    //   image: 'https://i.imgur.com/4u1aCXb.jpg',
    //   currency: currency,
    //   key: 'rzp_live_RGmSMq7cIoDFDR', // Your api key
    //   amount: 100,
    //   name: title,
    //   prefill: {
    //     email: this.props.user.user.email,
    //     name: this.props.user.user.name,
    //   },
    //   theme: { color: Colors.facebookBlue },
    // }
    // console.log(options)
    // RazorpayCheckout.open(options)
    //   .then(async (razorpayData) => {
    //     // console.log('<<<<',razorpayData)
    //     this.setState({ loading: true })

    //     var date = new Date().getTime()
    //     // var expiry = new Date(new Date().getTime() + 30 * 60 * 60 * 24 * 1000).toISOString()
    //     var uid = auth().currentUser.uid

    //     firestore().collection('users').doc(uid).update({
    //       [`transactions.${sessionId}.${date}`]: razorpayData.razorpay_payment_id,

    //       // [`expiry.${sessionId}`]: {
    //       //   expiry: expiry
    //       // }

    //     })

    //     try {
    //       var razorpayTransfer = await fetch(`https://api.razorpay.com/v1/payments/${razorpayData.razorpay_payment_id}/transfers`, {
    //       method: 'POST',
    //       headers: new Headers({
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //         'Authorization': `Basic ${base64.encode('rzp_live_RGmSMq7cIoDFDR:90cuaJxnCzdao4dN4uhKuHSF')}`

    //       }),
    //       body: JSON.stringify({
    //         transfers: [
    //           {
    //             account: linkedAccount,
    //             // amount: cost*100*transferRatio,
    //             amount: 100,
    //             currency: currency,
    //             notes: {
    //               [this.props.user.user.name]: '1',
    //               [this.props.user.user.email]: '1'
    //             },
    //             linked_account_notes: [this.props.user.user.name , this.props.user.user.email]
    //           },
    //         ]
    //       })
    //     })

    //     razorpayTransfer = await razorpayTransfer.json()
    //     console.log(razorpayTransfer)

    //     } catch (error) {
    //       console.log(error)
    //     }

    //     // fetch('https://us-central1-healer-fit-1.cloudfunctions.net/api/joinSession', {
    //     //   method: 'POST',
    //     //   headers: {
    //     //     Accept: 'application/json',
    //     //     'Content-Type': 'application/json'
    //     //   },
    //     //   body: JSON.stringify({
    //     //     uid: uid,
    //     //     sessionId: sessionId,
    //     //     trainer: trainer,
    //     //     name: this.props.user.user.name
    //     //   })
    //     // })
    //     //   .then((info) => {
    //     //     return info.text()
    //     //   })
    //     //   .then((info) => {
    //     //     // console.log("INFO", info)
    //     //     Toast.showWithGravity('Succesfully registered', Toast.LONG , Toast.CENTER);
    //     //     this.setState({ loading: false })
    //     //   })
    //     //   .catch(err => {
    //     //     this.setState({ loading: false })
    //     //     this.setState({ errorTitle: 'Error', errorMessage: 'Please reach out to us if error persists', errorModalVisible: true })
    //     //   })

    //   }).catch((error) => {

    //     // console.log("ERROR", error)

    //     this.setState({ loading: false })

    //   })
  };

  componentDidMount() {
    // if (this.props.trainerProfiles[this.state.uid] !== undefined) {

    //   this.setState({

    //     photoUrl: this.props.trainerProfiles[this.state.uid]['photoUrl'],
    //     bio: this.props.trainerProfiles[this.state.uid]['bio'],
    //     name: this.props.trainerProfiles[this.state.uid]['name'],
    //     sessions: this.props.trainerProfiles[this.state.uid]['sessions'],
    //     loading: false

    //   })

    // }
    // else {

    fetch(
      'https://us-central1-healer-fit-1.cloudfunctions.net/api/trainerProfile',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: this.state.uid,
        }),
      },
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState({
          photoUrl: res['photoUrl'],
          bio: res['bio'],
          name: res['name'],
          sessions: res['sessions'],
          loading: false,
        });

        this.props.dispatch({
          type: GET_TRAINER,
          payload: {
            id: this.state.uid,
            profile: res,
          },
        });
      })
      .catch(() => {
        this.setState({loading: false});
        this.setState({
          errorTitle: 'Error',
          errorMessage: 'Please go back and try again',
          errorModalVisible: true,
        });
      });

    // }
  }

  render() {
    // console.log(screenWidth)
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          paddingHorizontal: 20,
        }}>
        <DefaultLoader modalVisible={this.state.loading} />
        <InfoPopup
          title={this.state.errorTitle}
          subTitle={this.state.errorMessage}
          okButton={() => {
            this.setState({errorModalVisible: false});
          }}
          setEqualSpace={15}
          modalVisible={this.state.errorModalVisible}
          okText="OK"
        />
        <ScrollView>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Feather
              name="chevron-left"
              size={40}
              color={Colors.textPlaceholder}
              style={{
                position: 'absolute',
                top: 15,
                left: 15,
              }}
              onPress={() => this.props.navigation.goBack()}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {this.state.photoUrl !== '' && (
                <ImageIcon
                  source={{uri: this.state.photoUrl}}
                  height={100}
                  width={100}
                  borderRadius={20}
                />
              )}
            </View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: Colors.white,
                marginTop: 10,
                marginBottom: 5,
              }}>
              {this.state.name}
            </Text>
            <ReadMore
              numberOfLines={2}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.white,
                  alignSelf: 'center',
                }}>
                {this.state.bio}
              </Text>
            </ReadMore>
          </View>
          {this.state.sessions.length > 0 && (
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 25,
                color: Colors.white,
                marginTop: 35,
                marginBottom: 20,
                paddingLeft: 20,
              }}>
              Available Sessions
            </Text>
          )}
          <SafeAreaView>
            <FlatList
              // style={{flexDirection:'row'}}
              style={{paddingHorizontal: 20}}
              horizontal
              data={this.state.sessions}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => {
                var dt = new Date(item.time);
                var hours = dt.getHours();
                var minutes = dt.getMinutes();
                if (hours > 11) {
                  if (minutes < 10) {
                    dt = `${+hours - 12}:0${minutes} PM`;
                  } else {
                    dt = `${+hours - 12}:${minutes} PM`;
                  }
                } else {
                  if (hours < 10) {
                    if (minutes < 10) {
                      dt = `0${hours}:0${minutes} AM`;
                    } else {
                      dt = `0${hours}:${minutes} AM`;
                    }
                  }
                }

                return (
                  <View
                    style={{
                      width: screenWidth * 0.63,
                      marginRight: screenWidth * 0.1,
                      backgroundColor: Colors.boxBackground,
                      paddingHorizontal: 10,
                      paddingVertical: 20,
                      borderColor: Colors.boxBorder,
                      borderWidth: 2,
                      borderRadius: 20,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontWeight: 'bold',
                        fontSize: 25,
                      }}>
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        color: Colors.white,
                        fontWeight: 'bold',
                        fontSize: 15,
                        marginTop: 15,
                        marginBottom: 10,
                      }}>
                      ⏲️ Time: {dt}
                    </Text>
                    <Weekdays
                      width={screenWidth * 0.63}
                      activeDay={item.activeDay}
                      style={{alignSelf: 'center', width: screenWidth * 0.63}}
                    />
                    <View
                      style={{
                        backgroundColor: Colors.background,
                        borderColor: Colors.boxBorder,
                        borderWidth: 2,
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        marginVertical: 20,
                      }}>
                      <Text
                        style={{
                          color: Colors.white,
                          fontWeight: 'bold',
                          fontSize: 27,
                        }}>
                        {item.cost + ' ' + item.currency}{' '}
                        <Text
                          style={{
                            color: Colors.white,
                            fontWeight: 'bold',
                            fontSize: 15,
                          }}>
                          / 30 days
                        </Text>
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: Colors.white,
                        fontWeight: 'bold',
                        fontSize: 15,
                        marginBottom: 20,
                      }}>
                      ⚠️ Only {item.totalSpots - item.filledSpots} spots left
                    </Text>
                    <GradientButton
                      height={45}
                      width="95%"
                      borderRadius={22.5}
                      onPress={async () => {
                        await this.register(
                          item.currency,
                          item.cost,
                          item.title,
                          item.id,
                          item.trainer,
                          item.linkedAccount,
                          item.transferRatio,
                        );
                      }}
                      text="Register"
                    />
                  </View>
                );
              }}
            />
          </SafeAreaView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {marginTop: 15, marginLeft: 15},
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
    fontSize: 30,
    color: Colors.white,
  },
  signUpCaption: {
    fontSize: 15,
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

const mapStateToProps = (state) => {
  return {
    user: state.user,
    trainerProfiles: state.trainerProfiles,
  };
};
export default connect(mapStateToProps)(trainerProfile);
