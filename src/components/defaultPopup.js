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

import React, { Component } from 'react';
import { Text, View, Modal, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from './colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

export default class defaultErrorPopup extends Component {
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
                                // height: 200,
                                width: '80%',
                                backgroundColor: '#fff',
                                borderRadius: 10,
                                // alignItems: 'center',
                            }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }} >
                                <Text
                                    style={{
                                        color: '#000',
                                        fontSize: 20,
                                        marginRight: 25,
                                        marginLeft: 40,
                                        marginTop: 10,

                                    }}>
                                    {this.props.title}
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
                                        marginRight: 20,
                                        marginTop: 10,
                                        alignSelf: 'flex-end'
                                    }}
                                    onPress={this.props.closeButton}>
                                    <FontAwesome name="close" size={15} color="#4068e5" />
                                </TouchableOpacity>
                            </View>
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
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    width: '100%',
                                    borderTopColor: 'rgba(0,0,0,0.2)',
                                    borderTopWidth: 1,
                                }}>
                                <TouchableOpacity onPress={this.props.cancelButton}>
                                    <Text
                                        style={{
                                            color:
                                                !this.props.errorOrNot
                                                    ? 'rgba(0,0,0,1)'
                                                    : Colors.error,
                                            marginVertical: 15,
                                        }}
                                    >
                                        {this.props.cancelText}
                                    </Text>
                                </TouchableOpacity>
                                <View
                                    style={{
                                        height: '100%',
                                        width: 1,
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                    }}
                                />
                                <TouchableOpacity onPress={this.props.okButton}>
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
                    </View>
                </Modal>
            </View>
        );
    }
}
defaultErrorPopup.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    okButtonText: PropTypes.string,
    clickFunction: PropTypes.func,
    modalVisible: PropTypes.bool,
};
