import React, {Component} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from './colors';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image'
export default class profilePicIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: this.props.height,
      width: this.props.width,
      borderRadius: this.props.borderRadius,
    };
  }
  render() {
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[Colors.gradientLeft, Colors.gradientRight]}
        style={[
          {
            height: this.state.height,
            width: this.state.width,
            borderRadius: this.state.borderRadius,
            alignItems: 'center',
            justifyContent: 'center',
          },
          this.props.style,
        ]}>
        <TouchableOpacity onPress={this.props.onPress}>
          <FastImage
            style={{
              height: this.state.height * 0.9,
              width: this.state.width * 0.9,
              borderRadius: this.state.borderRadius * 0.9,
            }}
            source={this.props.source}
          />
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}
profilePicIcon.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  borderRadius: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
};
