import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../components/colors';
import ProfilePicIcon from '../components/profilePicIcon'
import { TextInputField } from './login';
import { connect } from 'react-redux'
import GradientButton from '../components/gradientButton';
import Popup from '../components/defaultPopup'
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth'
import InfoPopup from '../components/infoPopup'
import storage from '@react-native-firebase/storage'
import DefaultLoader from '../components/defaultLoader'
import FastImage from 'react-native-fast-image'
import { GET_SIGNUP } from '../redux/userRedux'

const screenWidth = Dimensions.get('window').width

class hostProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {

      exitPopup: false,
      uri: 'https://picsum.photos/200/300',
      errorTitle: '',
      errorMessage: '',
      errorModalVisible: false,
      photoLoading: false,
      loading: false,
      name: ''

    };
  }
  editPhotoFunction = () => {

    this.setState({ exitPopup: true })

  };
  onPressDone = async () => {

    if (!this.state.photoLoading) {

      if (this.state.name !== '') {

        this.setState({ loading: true })

        fetch('https://us-central1-healer-fit-1.cloudfunctions.net/api/signUp', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: auth().currentUser.email,
            uid: auth().currentUser.uid,
            photoUrl: this.state.uri,
            name: this.state.name
          })
        })
          .then(() => {

            this.props.dispatch({
              type: GET_SIGNUP,
              payload: true
            })

          })
          .catch(() => {

            this.setState({ loading: false })

            this.setState({ errorTitle: 'Error', errorMessage: 'Please try again', errorModalVisible: true })

          })

      }
      else {

        this.setState({ errorTitle: 'Fields missing', errorMessage: 'Name cannot be empty', errorModalVisible: true })

      }


    }


  };
  onChangeText = (key, val) => {

    this.setState({ [key]: val });

  };

  uploadImage = async (image) => {

    const uploadUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;

    try {
      await storage().ref(`${auth().currentUser.uid}/profile`).putFile(uploadUri)
      // console.log("1")
      const uri = await storage().ref(`${auth().currentUser.uid}/profile`).getDownloadURL()
      // console.log("2")
      this.setState({ uri: uri })
    } catch (error) {
      console.log("ERROR", error)
      Alert.alert(
        "Error",
        "There was an error uploading your avatar. Please Try again"
      )
    }

  }

  camera = async () => {

    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropperCircleOverlay: true,
      cropping: true
    })
      .then(async (image) => {
        this.setState({ photoLoading: true })
        await this.uploadImage(image['path'])
        this.setState({ photoLoading: false })
      })
      .catch(() => {

      })
  }

  file = async () => {

    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropperCircleOverlay: true,
      cropping: true
    })
      .then(async (image) => {
        this.setState({ photoLoading: true })
        await this.uploadImage(image['path'])
        this.setState({ photoLoading: false })
      })
      .catch(() => {

      })
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.rootContainer}>
          <DefaultLoader
            modalVisible={this.state.loading}
          />
          <Popup
            title="Select your avatar"
            subTitle="Its optional."
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
          <TouchableOpacity
            onPress={() => this.editPhotoFunction()}
          >
            <ProfilePic
              source={{ uri: this.state.uri }}
              editButton={this.editPhotoFunction}
              photoLoading={this.state.photoLoading}
            // photoLoading={true}
            />
          </TouchableOpacity>
          <EditTextField
            placeholder={'Name'}
            style={{ color: Colors.white, marginTop: 60 }}
            onChangeText={(val) => this.setState({ name: val })}
          />
          <DoneBar hideInfo={true} onPress={this.onPressDone} text="DONE" />
        </ScrollView>
      </SafeAreaView >
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
export default connect(mapStateToProps)(hostProfile)


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
            backgroundColor: 'black',
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
export class ProfilePic extends Component {
  render() {
    return (
      <View style={styles.photo}>
        <FastImage
          source={this.props.source}
          style={styles.backblob}
        />
        <ProfilePicIcon
          height={150}
          width={150}
          borderRadius={75}
          source={this.props.source}
          onPress={this.props.editButton}
          style={styles.profilePicIcon}
        />
        {!this.props.photoLoading && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={this.props.editButton}>
            <FontAwesome size={18} color={Colors.white} name="camera" />
          </TouchableOpacity>
        )}
        {this.props.photoLoading && (
          <View style={styles.editButton}>
            <ActivityIndicator size='large' color={Colors.gradientRight} />
          </View>
        )}
      </View>
    );
  }
}
export class ListItem extends Component {
  render() {
    return (
      <View
        style={{
          height: 60,
          width: '85%',
          borderRadius: 5,
          borderWidth: 1,
          backgroundColor: Colors.boxBackground,
          borderColor: Colors.boxBorder,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 15,
          alignSelf: 'center',
          marginBottom: 20,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FastImage
            source={this.props.source}
            style={{ height: 30, width: 40, resizeMode: 'contain' }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontFamily: 'Roboto-Bold', color: Colors.white }}>
              {this.props.title}
            </Text>
            {this.props.linkText != 'LINK' && (
              <Text style={{ color: Colors.textPlaceholder, fontSize: 12 }}>
                {this.props.subtitle}
              </Text>
            )}
          </View>
        </View>
        <Text
          onPress={this.props.linkFunction}
          style={{
            color: Colors.white,
            fontFamily: 'Roboto-Bold',
          }}>
          {this.props.linkText}
        </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    // paddingBottom: 60,
  },
  editButton: {
    height: 130,
    width: 130,
    marginTop: 30,
    position: 'absolute',
    borderRadius: 75,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    alignItems: 'center',
    marginTop: 50
  },
  profilePicIcon: {
    marginTop: 20,
  },
  backblob: {
    height: 200,
    width: 200,
    borderRadius: 100,
    position: 'absolute',
  },
});
