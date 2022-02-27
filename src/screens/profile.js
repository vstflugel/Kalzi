import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Dimensions, Switch,
  TextInput, SafeAreaView, Alert,
} from 'react-native';
import { Colors } from '../components/colors';
import ImageIcon from '../components/imageIcon';
import GradientButton from '../components/gradientButton';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import DefaultLoader from '../components/defaultLoader'
import Popup from '../components/defaultPopup'
import InfoPopup from '../components/infoPopup'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Entypo'
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage'
import Toast from 'react-native-simple-toast';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


import { connect } from 'react-redux'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideshow: false,
      loading: false,
      errorTitle: '',
      errorMessage: '',
      errorModalVisible: false,
      photoLoading: false,
      smoke: this.props.user.user.smoke,
      drink: this.props.user.user.drink,
      activity: this.props.user.user.activity,
      injury: this.props.user.user.injury,
      name: this.props.user.user.name,
      birthday: this.props.user.user.birthday,
      gender: this.props.user.user.gender,
      height: this.props.user.user.height,
      weight: this.props.user.user.weight,
      photoUrl: this.props.user.user.photoUrl,
      exitPopup: false
    };
  }

  componentDidMount() {

    // console.log("STATE", this.state.weight, this.state.gender, this.state.height, this.state.birthday, this.state.activity, this.state.injury)

  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.user.user !== prevProps.user.user) {

      // console.log('1', this.props.user.user.photoUrl)

      this.setState({
        smoke: this.props.user.user.smoke,
        drink: this.props.user.user.drink,
        activity: this.props.user.user.activity,
        injury: this.props.user.user.injury,
        name: this.props.user.user.name,
        birthday: this.props.user.user.birthday,
        gender: this.props.user.user.gender,
        height: this.props.user.user.height,
        weight: this.props.user.user.weight,
        photoUrl: this.props.user.user.photoUrl,
      })

    }

    if(this.state.photoUrl !== prevState.photoUrl) {
      console.log("PHOTO CHANGED", this.state.photoUrl , prevState.photoUrl)
    }

  }

  uploadImage = async (image) => {
    console.log(image)
    // const uploadUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;

    var uploadUri = image[0]['uri']
    console.log(image[0]['uri'])

    try {
      await storage().ref(`${auth().currentUser.uid}/profile`).putFile(uploadUri)
      // console.log("1")
      var uri = await storage().ref(`${auth().currentUser.uid}/profile`).getDownloadURL()
      // console.log("2")
      this.setState({ photoUrl: uri })

      firestore().collection('users').doc(auth().currentUser.uid).update({

        photoUrl: this.state.photoUrl,

      })


    } catch (error) {
      console.log("ERROR", error)
      Alert.alert(
        "Error",
        "There was an error uploading your avatar. Please Try again"
      )
    }

  }

  camera = async () => {

    // ImagePicker.openCamera({
    //   width: 500,
    //   height: 500,
    //   cropperCircleOverlay: true,
    //   cropping: true
    // })
    //   .then(async (image) => {
    //     this.setState({ photoLoading: true })
    //     await this.uploadImage(image['path'])
    //     this.setState({ photoLoading: false })
    //   })
    //   .catch(() => {

    //   })

    
    launchCamera({mediaType: 'photo'}, async (res) => {
      
      console.log(res)
      if (!res.didCancel) {
        this.setState({ loading: true })
        await this.uploadImage(res.assets)
        this.setState({ loading: false })
      }


    })

  }

  file = async () => {

    // ImagePicker.openPicker({
    //   width: 500,
    //   height: 500,
    //   cropperCircleOverlay: true,
    //   cropping: true
    // })
    //   .then(async (image) => {
    //     this.setState({ photoLoading: true })
    //     await this.uploadImage(image['path'])
    //     this.setState({ photoLoading: false })
    //   })
    //   .catch(() => {

    //   })

    launchImageLibrary({mediaType: 'photo'}, async (res) => {
      
      console.log(res)
      if (!res.didCancel) {
        this.setState({ loading: true })
        await this.uploadImage(res.assets)
        this.setState({ loading: false })
      }


    })
  }

  logoutFunction = async () => {

    try {
      await auth().signOut()
    } catch (error) {

    }
  }

  render() {

    return (
      // <SafeAreaView style={styles.parentContainer}>
      
        <KeyboardAwareScrollView style={styles.parentContainer}>
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
          <Popup
            title="Select your avatar"
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
          <Icon
            name="chevron-thin-left"
            size={30}
            color={Colors.textPlaceholder}
            style={{
              marginLeft: 0, marginTop: 15, marginBottom: 20
            }}
            onPress={() => this.props.navigation.goBack()}
          />
          <View>
            <View style={{ marginBottom: 10, flexDirection: 'row', marginHorizontal: 10, backgroundColor: 'black', paddingHorizontal: 10, paddingVertical: 10, borderColor: Colors.boxBorder, borderWidth: 2, borderRadius: 20, }}>
              <View style={{ alignSelf: 'center' }}>
                <ImageIcon onPress={() => {
                  this.setState({ exitPopup: true })
                }} source={{ uri: this.state.photoUrl }} height={screenHeight * 0.1} width={screenHeight * 0.1} borderRadius={screenHeight * 0.035} />
                {/* <FontAwesome size={18} color={Colors.white} name="camera" style={{ position: 'absolute', top: 42, left: 42 }} /> */}
              </View>
              <View style={{ justifyContent: 'space-around', flex: 3, alignItems: 'center', }} >
                {/* <Text style={{ color: Colors.textPlaceholder, fontWeight: 'bold', fontSize: 25, }}>{this.state.name}</Text> */}
                <TextInput style={{ color: Colors.white, fontWeight: 'bold', fontSize: 25, }}
                  defaultValue={this.state.name}
                  onChangeText={val => this.setState({ name: val })}
                  placeholder='name.'
                  textBreakStrategy='simple'
                  placeholderTextColor={Colors.textPlaceholder}
                  // textAlign='center'
                  scrollEnabled={false}
                  multiline={false}
                />
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }} >
                  <TextInput style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, alignSelf: 'center' }}
                    defaultValue={this.state.birthday}
                    onChangeText={val => this.setState({ birthday: val })}
                    placeholder='age?'
                    placeholderTextColor={Colors.textPlaceholder}
                    textAlign='right'
                    scrollEnabled={false}
                    multiline={false}
                  />
                  <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, alignSelf: 'center' }}> yrs ·</Text>
                  <TextInput style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, alignSelf: 'center' }}
                    defaultValue={this.state.gender}
                    onChangeText={val => this.setState({ gender: val })}
                    placeholder='gender?'
                    placeholderTextColor={Colors.textPlaceholder}
                    multiline={false}
                    scrollEnabled={false}
                  // textAlign='center'
                  />
                </View>
              </View>
              <Icon size={20} name='chevron-thin-right' style={{ alignSelf: 'center', marginRight: 20 }} color={Colors.textPlaceholder} />
            </View>
          </View>
          <Text
            style={{
              color: Colors.textPlaceholder,
              alignSelf: 'center',
            }}>
            Looking for a place to{' '}
            <Text style={{ color: Colors.error }} onPress={async () => {
              await this.logoutFunction()
            }}>
              Logout?
            </Text>
          </Text>
          <View>
            <View style={{ marginTop: 10, height: screenHeight * 0.1, marginBottom: 15, flexDirection: 'row', marginHorizontal: 10, backgroundColor: Colors.boxBackground, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 20, }}>
              <View style={{ justifyContent: 'space-around', flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                <View style={{ borderRightColor: Colors.textPlaceholder, borderRightWidth: 1, flex: 2 }} >
                  <TextInput style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, alignSelf: 'center' }}
                    defaultValue={this.state.weight}
                    onChangeText={val => this.setState({ weight: val })}
                    placeholder='Enter Weight'
                    placeholderTextColor={Colors.textPlaceholder}
                    textAlign='center'
                  />
                  <Text style={{ color: Colors.textPlaceholder, fontWeight: 'bold', fontSize: 12, alignSelf: 'center' }}>Weight</Text>
                </View>
                <View style={{ flex: 2 }} >
                  <TextInput style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, alignSelf: 'center' }}
                    defaultValue={this.state.height}
                    onChangeText={val => this.setState({ height: val })}
                    placeholder='Enter Height'
                    placeholderTextColor={Colors.textPlaceholder}
                    textAlign='center'
                  />
                  <Text style={{ color: Colors.textPlaceholder, fontWeight: 'bold', fontSize: 12, alignSelf: 'center' }}>Height</Text>
                </View>
              </View>
            </View>
            <FontAwesome
              name="edit"
              color={Colors.textPlaceholder}
              size={20}
              style={{ position: 'absolute', top: 7, right: 10 }}
            />
          </View>
          <Text style={{ color: Colors.white, marginBottom: 20, fontWeight: 'bold', fontSize: 25, alignSelf: 'flex-start', paddingHorizontal: 10 }}>Health Data</Text>
          <View style={{ marginBottom: 15, flexDirection: 'row', marginHorizontal: 10, backgroundColor: Colors.boxBackground, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 20, }}>
            <View style={{ marginLeft: 10, justifyContent: 'space-between', flex: 1, alignItems: 'center', flexDirection: 'row' }} >
              <Text style={{ color: Colors.textPlaceholder, fontWeight: 'bold', fontSize: 20, alignSelf: 'center' }}>Do you smoke?</Text>
              <Switch
                trackColor={{ false: "#767577", true: Colors.gradientRight }}
                thumbColor={this.state.smoke ? Colors.gradientLeft : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => this.setState({ smoke: value })}
                value={this.state.smoke}
              />
            </View>
          </View>
          <View style={{ marginBottom: 15, flexDirection: 'row', marginHorizontal: 10, backgroundColor: Colors.boxBackground, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 20, }}>
            <View style={{ marginLeft: 10, justifyContent: 'space-between', flex: 1, alignItems: 'center', flexDirection: 'row' }} >
              <Text style={{ color: Colors.textPlaceholder, fontWeight: 'bold', fontSize: 20, alignSelf: 'center' }}>Do you drink?</Text>
              <Switch
                trackColor={{ false: "#767577", true: Colors.gradientRight }}
                thumbColor={this.state.drink ? Colors.gradientLeft : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => this.setState({ drink: value })}
                value={this.state.drink}
              />
            </View>
          </View>

          <View style={{ marginBottom: 25, flexDirection: 'row', marginHorizontal: 10, backgroundColor: Colors.boxBackground, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 20, }}>
            <View style={{ marginLeft: 10, justifyContent: 'space-between', flex: 1, alignItems: 'center', flexDirection: 'row' }} >
              <Text style={{ color: Colors.textPlaceholder, fontWeight: 'bold', fontSize: 20, alignSelf: 'center', }}>Activity</Text>
              <TextInput
                defaultValue={this.state.activity}
                placeholder='How active are you?'
                placeholderTextColor={Colors.textPlaceholder}
                onChangeText={val => this.setState({ activity: val })}
                textAlign='center'
                // value={this.state.activity}
                style={{ color: Colors.white }}
              />
              {/* <Picker
              dropdownIconColor={Colors.white}
              mode='dropdown'
              // itemStyle={{color: Colors.white}}
              style={{color: Colors.white , borderColor: 'red', borderWidth: 1 , flex:1 , borderRadius: 5}}
              selectedValue={'sedentary'}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({activity: itemValue})
              }>
              <Picker.Item color={Colors.white} label="Sedentary" value="sedentary" />
              <Picker.Item  color={Colors.white}label="Somewhat" value="somewhat" />
              <Picker.Item color={Colors.white} label="Very active" value="very active" />
            </Picker> */}
            </View>
          </View>

          <Text style={{ color: Colors.white, marginBottom: 20, fontWeight: 'bold', fontSize: 20, alignSelf: 'flex-start', paddingHorizontal: 10 }}>Injuries and other details</Text>
          <View style={{ marginBottom: 25, flexDirection: 'row', marginHorizontal: 10, backgroundColor: Colors.boxBackground, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 20, }}>
            <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center', flexDirection: 'row' }} >
              <TextInput
                placeholder='Anything your trainer should know?'
                defaultValue={this.state.injury}
                placeholderTextColor={Colors.textPlaceholder}
                onChangeText={val => this.setState({ injury: val })}
                // textAlign='center'
                // value={this.state.injury}
                style={{ color: Colors.white }}
              />
            </View>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 30 }} >
            <GradientButton
              height={40}
              width={screenWidth * 0.75}
              borderRadius={5}
              text='UPDATE'
              onPress={() => {

                firestore().collection('users').doc(auth().currentUser.uid).update({

                  smoke: this.state.smoke,
                  drink: this.state.drink,
                  activity: this.state.activity,
                  injury: this.state.injury,
                  name: this.state.name,
                  birthday: this.state.birthday,
                  gender: this.state.gender,
                  height: this.state.height,
                  weight: this.state.weight,
                  photoUrl: this.state.photoUrl,

                })

                Toast.showWithGravity('Succesfully updated', Toast.LONG, Toast.CENTER);

              }}
            />
          </View>
        </KeyboardAwareScrollView>
      // </SafeAreaView>
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
export default connect(mapStateToProps)(home)

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
    justifyContent: 'space-between',
    marginBottom: 30
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
