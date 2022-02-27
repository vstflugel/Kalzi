import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { Colors } from './colors';
export default class gradientButton extends Component {
  render() {
    if (this.props.border === undefined) {

      return (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[Colors.gradientLeft, Colors.gradientRight]}
          style={[
            {
              height: this.props.height,
              width: this.props.width,
              borderRadius: this.props.borderRadius,
            },
            this.props.style,
          ]}>
          <TouchableOpacity
            onPress={this.props.onPress}
            style={[
              {
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
              },
              this.props.styleChildren,
            ]}>
            {this.props.text && (
              <Text
                style={{ alignSelf: 'center', fontFamily: 'Roboto-Bold', color: '#fff', fontWeight: 'bold' }}>
                {this.props.text}
              </Text>
            )}
            {this.props.children}
          </TouchableOpacity>
        </LinearGradient>
      );
    }
    else {

      return (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[Colors.gradientLeft, Colors.gradientRight]}
          style={[
            {
              height: this.props.height,
              width: this.props.width,
              borderRadius: this.props.borderRadius,
              justifyContent: 'center',
              alignItems:'center'
            },
            this.props.style,
          ]}>
          <TouchableOpacity
            onPress={this.props.onPress}
            style={[
              {
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%',
                width: '98%',
                backgroundColor: Colors.background,
                borderRadius: this.props.borderRadius,
              },
              this.props.styleChildren,
            ]}>
            {this.props.text && (
              <Text
                style={{ alignSelf: 'center', fontFamily: 'Roboto-Bold', color: '#fff', fontWeight: 'bold' }}>
                {this.props.text}
              </Text>
            )}
            {this.props.children}
          </TouchableOpacity>
        </LinearGradient>
      );

    }

  }
}
gradientButton.propTypes = {
  height: PropTypes.number.isRequired,
  // width: PropTypes.string.isRequired,
  borderRadius: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  text: PropTypes.string,
};
