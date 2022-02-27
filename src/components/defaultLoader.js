// How to use this thing:
// <DefaultLoader
//   modalVisible={this.state.exitPopup}
// />
// Now to make it toggle, toggle state modalVisibile.

import React, {Component} from 'react';
import {
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {Colors} from './colors';
export default class defaultLoader extends Component {
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
            <ActivityIndicator size="large" color={Colors.facebookBlue} />
          </View>
        </Modal>
      </View>
    );
  }
}
defaultLoader.propTypes = {
  modalVisible: PropTypes.bool,
};
