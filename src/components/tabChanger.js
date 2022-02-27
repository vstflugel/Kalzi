import React , {Component} from 'react'
import {View ,Dimensions } from 'react-native'
import GradientButton from './gradientButton'
import UnselectedButton from './unselectedButton'

const screenWidth = Math.round(Dimensions.get('window').width)

export default class TabChanger extends Component {
    constructor(props) {
      super(props);
      this.state = {
        currentActive: 'ACTIVE',
      };
    }
    changeCurrentTab = async (current) => {
      await this.setState({currentActive: current});
    };
    render() {
      return (
        <View style={[{marginBottom: 40}, this.props.style]}>
          {this.state.currentActive == 'ACTIVE' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
                width: '80%',
              }}>
              <GradientButton
                height={40}
                width={screenWidth * 0.38}
                borderRadius={5}
                text={this.props.tabOne}
                onPress={() => {}}
              />
              <UnselectedButton
                height={40}
                width={screenWidth * 0.38}
                borderRadius={5}
                text={this.props.tabTwo}
                onPress={() => {
                  this.props.changeCurrentTab(this.props.tabTwo);
                  this.changeCurrentTab('UPCOMING');
                }}
              />
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
                width: '80%',
              }}>
              <UnselectedButton
                height={40}
                width={screenWidth * 0.38}
                borderRadius={5}
                text={this.props.tabOne}
                onPress={() => {
                  this.props.changeCurrentTab(this.props.tabOne);
                  this.changeCurrentTab('ACTIVE');
                }}
              />
              <GradientButton
                height={40}
                width={screenWidth * 0.38}
                borderRadius={5}
                text={this.props.tabTwo}
                onPress={() => {}}
              />
            </View>
          )}
        </View>
      );
    }
  }