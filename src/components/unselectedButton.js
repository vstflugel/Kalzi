
import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Colors} from './colors';
import PropTypes from 'prop-types';
export default class unselectedButton extends Component {
  render() {
    return (
      <View
        style={[
          {
            backgroundColor: Colors.boxBackground,
            borderWidth: 1,
            borderRadius: this.props.borderRadius,
            borderColor: Colors.boxBorder,
            height: this.props.height + 1,
            width: this.props.width + 1,
            alignSelf: 'center',
          },
          this.props.style,
        ]}>
        <TouchableOpacity
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={this.props.onPress}>
          <Text
            style={{
              alignSelf: 'center',
              fontFamily: 'Roboto-Bold',
              color: Colors.textPlaceholder,
            }}>
            {this.props.text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
unselectedButton.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  borderRadius: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};
