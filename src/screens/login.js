import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Linking,
  TouchableOpacity,
  Alert,
  Switch
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../components/colors';
import GradientButton from '../components/gradientButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
const screenWidth = Math.round(Dimensions.get('window').width);
import InfoPopup from '../components/infoPopup'
import { connect } from 'react-redux'
import { GET_SIGNUP } from '../redux/userRedux'
import DefaultLoader from '../components/defaultLoader'
import {persistor} from '../redux'
import FastImage from 'react-native-fast-image'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorTitle: '',
      errorMessage: '',
      errorModalVisible: false,
      loading: false,
      rememberMe: true
    };
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };

  logIn = () => {

    if (this.state.email !== '' && this.state.password !== '') {
      this.rememberUser();

      this.setState({loading: true})

      this.props.dispatch({
        type: GET_SIGNUP,
        payload: true
      })

      auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {

          // this.props.navigation.navigate('Home')

        })
        .catch((err) => {

          this.setState({loading: false})

          this.props.dispatch({
            type: GET_SIGNUP,
            payload: false
          })

          this.setState({ errorTitle: 'Error', errorMessage: `${err.code}`, errorModalVisible: true })

        })

    }
    else {

      this.setState({ errorTitle: 'Fields missing', errorMessage: 'Please Enter All Fields', errorModalVisible: true })

    }

  }

  async componentDidMount() {

    const username = await this.getRememberedUser();
    this.setState({ 
      email: username || "", 
      rememberMe: username ? true : false 
    });

    // try {
    //   await persistor.purge()
    // } catch (error) {
      
    // }

  }

  toggleRememberMe = value => {
    this.setState({ rememberMe: value })
    if (value === true) {
      // user wants to be remembered.
      this.rememberUser();
    } else {
      this.forgetUser();
    }
  }

  rememberUser = async () => {
    try {
      await AsyncStorage.setItem('credentials', this.state.email);
    } catch (error) {
      // Error saving data
    }
  };
  
  getRememberedUser = async () => {
    try {
      const username = await AsyncStorage.getItem('credentials');
      if (username !== null) {
        // We have username!!
        return username;
      }
    } catch (error) {
      // Error retrieving data
      return '';
    }
  };
  
  forgetUser = async () => {
    try {
      await AsyncStorage.removeItem('credentials');
    } catch (error) {
      // Error removing
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView style={styles.rootContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
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
            <FastImage style={styles.logo} source={require('./kalzi.png')} />
            {/* App Name */}
            <Text style={styles.ausyter}>Kalzi</Text>

            {/* Username TextInput*/}
            <TextInputField
              placeholder="Email"
              value = {this.getRememberedUser()}
              onChangeText={(val) => this.onChangeText('email', val)}
              error={this.state.errorInUsername}
              errorBorder={this.state.errorInUsername}
              errorMessage="User Not Found"
            />

            {/* Password TextInput */}
            <TextInputField
              placeholder="Password"
              onChangeText={(val) => this.onChangeText('password', val)}
              error={this.state.errorInPassword}
              errorBorder={this.state.errorInPassword}
              errorMessage="Incorrect Password"
              iconAvailable={true}
            />
          
            {/* Remember Me toggle switch*/}
            {/* <View style={{ marginBottom: 15, flexDirection: 'row', marginHorizontal: 10, paddingHorizontal: 25, paddingVertical: 10, borderRadius: 20, }}>
              <View style={{ marginLeft: 10, justifyContent: 'space-between', flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                <Text style={{ color: Colors.textPlaceholder, fontSize: 15, alignSelf: 'center' }}>Remember Me</Text>
                <Switch  
                  trackColor={{ false: "#767577", true: Colors.gradientRight }}
                  thumbColor={this.state.smoke ? Colors.gradientLeft : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e" 
                  onValueChange={(value) => this.toggleRememberMe(value)}
                  value={this.state.rememberMe} 
                />
              </View>
            </View> */}

            {/* Forgot Password Button */}
            {/* <Text
              style={styles.forgotPassword}
              onPress={() => this.props.navigation.navigate('ForgotPassword')}>
              Forgot Password?
            </Text> */}

            {/* LOGIN Button */}
            <GradientButton
              height={50}
              width={0.8 * screenWidth}
              borderRadius={5}
              text="LOG IN"
              onPress={this.logIn}
              style={styles.gradientButton}
            />

            {/* Sign Up Navigation button. */}
            <Text style={styles.dontHave}>
              Don't have an account?
              <Text
                style={styles.signUp}
                onPress={() => this.props.navigation.navigate('SignUp')}>
                {'  '}Sign Up!
              </Text>
            </Text>


            {/* Facebook and Google Login Buttons */}
            {/* <ExternalLogin
              googleSignIn={this.googleSignIn}
              facebookSignIn={this.facebookSignIn}
            /> */}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => {
  return (
    {
      user: state.user,
    }
  )
}
export default connect(mapStateToProps)(Login)

// -------------------------------------------------------------------------------

// Stylesheet for Login.js

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: Colors.background },
  logo: {
    height: 60,
    width: 60,
    // backgroundColor: Colors.error,
    alignSelf: 'center',
    marginTop: '25%',
    // borderRadius: 20,
  },
  forgotPassword: {
    color: Colors.error,
    fontSize: 12,
    alignSelf: 'flex-end',
    marginRight: '12%',
    marginTop: -20,
  },
  gradientButton: { alignSelf: 'center', marginTop: 40 },
  dontHave: {
    color: Colors.textPlaceholder,
    alignSelf: 'center',
    marginTop: 10,
  },
  signUp: {
    color: Colors.error,
    // fontFamily: 'Roboto-Bold',
    fontFamily: 'Roboto-Bold',
  },
  ausyter: {
    fontFamily: 'LobsterTwo-Italic',
    color: Colors.white,
    fontSize: 35,
    alignSelf: 'center',
    marginBottom: 50,
    marginTop: 10,
  },
  or: {
    color: Colors.textPlaceholder,
    alignSelf: 'center',
    marginVertical: 40,
  },
});


// const mapStateToProps = state => {
//   return (
//     {
//       user: state.user,
//       rooms: state.rooms
//     }
//   )
// }

// export default connect(mapStateToProps)(Login)

// ----------------------------------------------------------------------------

// Login with Facebook/Google View.
// Props are:
//    1.) facebookSignIn: Function, on press open the facebook login instance.
//    2.) googleSignIn: Function, on press open the google login instance.

export class ExternalLogin extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: '10%',
        }}>
        <TouchableOpacity
          onPress={this.props.facebookSignIn}
          style={{
            height: 50,
            width: (screenWidth * 0.75) / 2,
            backgroundColor: Colors.white,
            borderRadius: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <FontAwesome name="facebook" color={Colors.facebookBlue} size={20} />
          <Text style={{ color: Colors.facebookBlue, fontFamily: 'Roboto-Bold', }}>
            Facebook
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.props.googleSignIn}
          style={{
            height: 50,
            width: (screenWidth * 0.75) / 2,
            backgroundColor: Colors.white,
            borderRadius: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <FontAwesome name="google" color={Colors.error} size={20} />
          <Text style={{ color: Colors.error, fontFamily: 'Roboto-Bold', }}>Google</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// -----------------------------------------------------------------------------
// TextInputField Prop.
// Props are:
//      1.) style: Style object, styling prop for the whole view.
//      2.) placeholder: String, eg: 'Username'
//      3.) textPlaceholder: String, eg: '#fff' , color for above.
//      4.) onChangeText: Function,
//      5.) error: Boolean, when true, UI indicates error and shows errorMessage below it.
//      6.) errorBorder: Boolean, when true, border turns red.
//      7.) success: Boolean, when true, UI indicates green color and the errorMessage.
//      8.) successBorder: Boolean, when true, border turns green.
//      9.) errorMessage: String, the message to be delivered when there is an error.
//
export class TextInputField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordVisible: false,
    };
    this._togglePasswordVisibility = this._togglePasswordVisibility.bind(this);
  }
  _togglePasswordVisibility = () => {
    this.setState({ passwordVisible: !this.state.passwordVisible });
  };
  render() {
    return (
      <View
        style={[
          {
            backgroundColor: Colors.boxBackground,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: this.props.errorBorder
              ? Colors.error
              : this.props.successBorder
                ? Colors.success
                : Colors.boxBorder,
            // borderColor: Colors.boxBorder, //
            height: this.props.height || 50,
            width: this.props.width || '80%',
            alignSelf: 'center',
            marginBottom: 20,
            justifyContent: 'center'
          },
          this.props.style,
        ]}>
        <TextInput
          maxLength={this.props.maxLength}
          placeholder={this.props.placeholder}
          keyboardType={this.props.keyboardType}
          placeholderTextColor={this.props.placeholderTextColor || Colors.textPlaceholder}
          secureTextEntry={
            this.props.placeholder == 'Password' || this.props.placeholder == 'New Password' ||
              this.props.placeholder == 'Confirm Password'
              ? !this.state.passwordVisible
              : false
          }
          returnKeyType={this.props.placeholder == 'Search' ? 'search' : 'done'}
          onChangeText={this.props.onChangeText}
          multiline={this.props.multiline}
          numberOfLines={this.props.numberOfLines}
          textAlignVertical={'center'}
          onSubmitEditing={this.props.onSubmitEditing}
          style={[
            {
              paddingLeft: 15,
              paddingRight: this.props.iconAvailable ? 50 : 15,
              color: Colors.white,
            },
            this.props.textInputStyle,
          ]}
        />
        {this.props.children}
        {(this.props.placeholder == 'Password' || this.props.placeholder == 'New Password') && (
          <Feather
            name={this.state.passwordVisible ? 'eye' : 'eye-off'}
            size={20}
            color={Colors.textPlaceholder}
            style={{ position: 'absolute', right: 15, top: 13 }}
            onPress={this._togglePasswordVisibility}
          />
        )}
        {(this.props.error || this.props.success) && (
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              width: '60%',
              color: this.props.success ? Colors.success : Colors.error,
              position: 'absolute',
              bottom: -15,
              left: 10,
              fontSize: 10,
            }}>
            {this.props.errorMessage}
          </Text>
        )}
      </View>
    );
  }
}
