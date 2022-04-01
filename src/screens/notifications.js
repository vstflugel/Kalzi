import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  SafeAreaView,
} from 'react-native';
import ImageIcon from '../components/imageIcon';
import {Colors} from '../components/colors';

import Icon from 'react-native-vector-icons/Entypo';
import DefaultLoader from '../components/defaultLoader';
// import InfoPopup from '../components/infoPopup';

import {connect} from 'react-redux';
// import {GET_PARTICIPANTS} from '../redux/trainerRedux';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// getnotification();
// {
//   return firestone().collection('notification').doc('messages');
// }

const screenWidth = Dimensions.get('window').width;
function notifications({navigation}) {
  return (
    <SafeAreaView style={styles.parentContainer}>
      <View style={styles.parentContainer}>
        <Icon
          name="chevron-thin-left"
          size={30}
          color={Colors.textPlaceholder}
          style={{marginTop: 20, marginLeft: -2}}
        />
        <FlatList
          ListHeaderComponent={
            <View style={{marginBottom: 10}}>
              <View style={styles.topBarContainer}>
                <View style={{marginBottom: 20}}>
                  <Text style={styles.text}>View </Text>
                  <Text style={styles.username}>Notifications </Text>
                </View>
                <ImageIcon
                  source={{uri: this.props.user.user.photoUrl}}
                  height={70}
                  width={70}
                  borderRadius={35}
                />
              </View>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

class Notifications extends Component {
  render() {
    return (
      <SafeAreaView style={styles.parentContainer}>
        <View style={styles.parentContainer}>
          <Icon
            name="chevron-thin-left"
            size={30}
            color={Colors.textPlaceholder}
            style={{marginTop: 20, marginLeft: -2}}
          />
          <FlatList
            ListHeaderComponent={
              <View style={{marginBottom: 10}}>
                <View style={styles.topBarContainer}>
                  <View style={{marginBottom: 20}}>
                    {/* <Text style={styles.text}>View </Text> */}
                    <Text style={styles.username}>Notifications </Text>
                  </View>
                  <ImageIcon
                    source={{uri: this.props.user.user.photoUrl}}
                    height={70}
                    width={70}
                    borderRadius={35}
                  />
                </View>
                <Text style={styles.username}>
                  {/* This is the space for notification{firestore().collection('notification').doc('messages').data()} */}
                </Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    trainer: state.trainer,
  };
};
export default connect(mapStateToProps)(Notifications);

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
    justifyContent: 'space-between',
  },
  text: {
    color: Colors.white,
    fontSize: 20,
    marginTop: 10,
  },
  username: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 30,
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
    fontWeight: 'bold',
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
    marginRight: screenWidth * 0.05,
  },
});
