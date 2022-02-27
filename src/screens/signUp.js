import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Colors } from '../components/colors';
import { TextInputField } from './login'; //Also check comments in Login.js to use TextInputField and ExternalLogin.
import GradientButton from '../components/gradientButton';
import Feather from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from "@react-native-firebase/auth";
const screenWidth = Math.round(Dimensions.get('window').width);
import InfoPopup from '../components/infoPopup'
import DefaultLoader from '../components/defaultLoader'

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      // confirmpassword: '',
      errorTitle: '',
      errorMessage: '',
      errorModalVisible: false,
      errorInEmail: false,
      loading: false
    };
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val });

    if (key == 'email') {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(val) === false) {
        this.setState({
          errorInEmail: true,
          email: val
        })

      } else {
        this.setState({
          errorInEmail: false,
          email: val
        })
      }
    }
    else {
      this.setState({ key: val });
    }

    // Check email correctness here as well.
  };

  onRegister = () => {
    if (this.state.email !== '' && this.state.password !== '' && !this.state.errorInEmail) {
      this.setState({loading: true})

      auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          console.log('sign up hello')

          // this.props.navigation.navigate('Home')

        })
        .catch((err) => {
          this.setState({loading: false})

          if (err.code === 'auth/weak-password' ) {
            this.setState({ errorTitle: 'Error', errorMessage: "Password has to be more than 6 characters", errorModalVisible: true })
          } else {
            this.setState({ errorTitle: 'Error', errorMessage: `${err.code}`, errorModalVisible: true })
          }

        })

    }
    else {
      this.setState({ errorTitle: 'Fields missing', errorMessage: 'Please Enter All Fields', errorModalVisible: true })

    }

  };

  render() {

    return (

      <SafeAreaView style={{ backgroundColor: Colors.background, flex: 1 }}>
        <DefaultLoader
          modalVisible={this.state.loading}
        />
        <InfoPopup
          title={this.state.errorTitle}
          subTitle={this.state.errorMessage}
          okButton={() => {
            this.setState({ errorModalVisible: false });  //On pressing OK or Cancel the popup should eventually disappear.
          }}
          setEqualSpace={15}       //This is to set margins equal in the Cancel/OK View.
          modalVisible={this.state.errorModalVisible}
          okText="OK"
        />
        <View style={styles.topBar}>
          <Feather
            name="chevron-left"
            size={40}
            color={Colors.textPlaceholder}
            style={styles.backButton}
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={styles.blob}>

          </View>
          <View style={styles.blobText}>
            <Text style={styles.signUp}>Sign Up</Text>
            <Text style={styles.signUpCaption}>A Healthy you is a step away!</Text>
          </View>
        </View>
        <KeyboardAwareScrollView style={{ paddingTop: 30 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {/* Check email correctness and if not correct set error and errorBorder true. */}
              <TextInputField
                placeholder="Email"
                onChangeText={(val) => this.onChangeText('email', val)}
                error={this.state.email != '' && this.state.errorInEmail}
                errorBorder={this.state.errorInEmail}
                errorMessage={'Please Enter a valid Email'}
              />

              {/* Check username availability and if available set error and errorBorder to true, and 
                  use appropriate errorMessage like "'hasir' is available."
              */}

              {/* Password matching is already checked. */}
              <TextInputField
                placeholder="Password"
                onChangeText={(val) => this.onChangeText('password', val)}
                error={false}
                errorBorder={false}
                errorMessage="Incorrect Password"
                iconAvailable={false}
              />

              {/* In this confirm password is already checked. */}
              {/* <TextInputField
                placeholder="Confirm Password"
                onChangeText={(val) =>
                  this.onChangeText('confirmpassword', val)
                }
                errorBorder={
                  this.state.password != this.state.confirmpassword &&
                    this.state.confirmpassword != ''
                    ? true
                    : false
                }
                error={
                  this.state.password != this.state.confirmpassword &&
                    this.state.confirmpassword != ''
                    ? true
                    : false
                }
                errorMessage="Passwords do not match."
              /> */}

              {/* Just edit the signUp function above. */}
              <GradientButton
                height={50}
                width={0.8 * screenWidth}
                borderRadius={5}
                text="SIGN UP"
                onPress={() => {
                  this.onRegister();
                }}
                style={styles.gradientButton}
              />
              {/* Log In Navigation button. */}
              <Text style={styles.dontHave}>
                Already have an account?
                <Text
                  style={styles.logIn}
                  onPress={() => this.props.navigation.navigate('Login')}>
                  {'  '}Log In!
                </Text>
              </Text>

            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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

