// How to use this thing:
// <ErrorPopup
//   title="Exit"
//   subTitle="Are you sure you want to exit the room, you would have to pay again to join."
//   cancelButton={() => this.setState({exitPopup: false})}
//   okButton={() => {
//     this.setState({exitPopup: false});  //On pressing OK or Cancel the popup should eventually disappear.
//     this.exitRoomFunction();
//   }}
//   setEqualSpace={15}       //This is to set margins equal in the Cancel/OK View.
//   modalVisible={this.state.exitPopup}
//   okText="OK"
//   cancelText="Cancel"
// />
// Now to make it toggle, toggle state modalVisibile.

import React, {Component} from 'react';
import {Text, View, Modal, Dimensions, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Colors} from './colors';
export default class infoPopup extends Component {
  render() {
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.modalVisible}
          onRequestClose={() => {
            //Alert.alert('Modal has been closed.');
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
                width: '80%',
                backgroundColor: '#fff',
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 20,
                  marginHorizontal: 25,
                  fontFamily: 'Roboto-Bold',
                  marginTop: 10,
                }}>
                {this.props.title}
              </Text>
              <Text
                style={{
                  color: 'rgba(0,0,0,0.7)',
                  fontSize: 15,
                  marginTop: 10,
                  marginHorizontal: 25,
                  alignSelf: 'center',
                  textAlign: 'center',
                  marginBottom: 20,
                }}>
                {this.props.subTitle}
              </Text>
              <TouchableOpacity
                onPress={this.props.okButton}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  width: '100%',
                  borderTopColor: 'rgba(0,0,0,0.2)',
                  borderTopWidth: 1,
                }}>
                <Text
                  style={{
                    color: Colors.facebookBlue,
                    marginVertical: 15,
                    marginHorizontal: this.props.setEqualSpace,
                  }}>
                  {this.props.okText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
infoPopup.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  okText: PropTypes.string.isRequired,
  okButton: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
};
