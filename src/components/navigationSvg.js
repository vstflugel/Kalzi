import React, {Component} from 'react';
import {View} from 'react-native';
import Svg, {G, Defs, LinearGradient, Stop, Path} from 'react-native-svg';
import PropTypes from 'prop-types';
import {Colors} from './colors';
export default class navigationSvg extends Component {
  render() {
    return (
      <View style={this.props.style}>
        {this.props.name == 'homeSelected' && (
            <Svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M7.135 18.773v-3.057c0-.78.637-1.414 1.423-1.414h2.875c.377 0 .74.15 1.006.414.267.265.417.625.417 1v3.057c-.002.325.126.637.356.867.23.23.544.36.87.36h1.962a3.46 3.46 0 002.443-1 3.41 3.41 0 001.013-2.422V7.867c0-.735-.328-1.431-.895-1.902L11.934.675a3.097 3.097 0 00-3.949.072L1.467 5.965A2.474 2.474 0 00.5 7.867v8.702C.5 18.464 2.047 20 3.956 20h1.916c.68 0 1.231-.544 1.236-1.218l.027-.009z"
                fill="url(#prefix__paint0_linear)"
              />
              <Defs>
                <LinearGradient
                  id="prefix__paint0_linear"
                  x1={1}
                  y1={10}
                  x2={20}
                  y2={10}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop stopColor="#069FC8" />
                  <Stop offset={1} stopColor="#7F2FDC" />
                </LinearGradient>
              </Defs>
            </Svg>
        )}
        {this.props.name == 'home' && (
            <Svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M7.135 18.773v-3.057c0-.78.637-1.414 1.423-1.414h2.875c.377 0 .74.15 1.006.414.267.265.417.625.417 1v3.057c-.002.325.126.637.356.867.23.23.544.36.87.36h1.962a3.46 3.46 0 002.443-1 3.41 3.41 0 001.013-2.422V7.867c0-.735-.328-1.431-.895-1.902L11.934.675a3.097 3.097 0 00-3.949.072L1.467 5.965A2.474 2.474 0 00.5 7.867v8.702C.5 18.464 2.047 20 3.956 20h1.916c.68 0 1.231-.544 1.236-1.218l.027-.009z"
                fill="#557794"
              />
            </Svg>
        )}
        {this.props.name == 'chatSelected' && (
            <Svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 10.015C0 4.747 4.21 0 10.02 0 15.7 0 20 4.657 20 9.985 20 16.165 14.96 20 10 20c-1.64 0-3.46-.44-4.92-1.302-.51-.31-.94-.54-1.49-.36l-2.02.6c-.51.16-.97-.24-.82-.78l.67-2.244c.11-.31.09-.641-.07-.902C.49 13.43 0 11.697 0 10.015zm8.7 0c0 .711.57 1.282 1.28 1.292.71 0 1.28-.58 1.28-1.282 0-.711-.57-1.282-1.28-1.282-.7-.01-1.28.571-1.28 1.272zm4.61.01c0 .701.57 1.282 1.28 1.282.71 0 1.28-.58 1.28-1.282 0-.711-.57-1.282-1.28-1.282-.71 0-1.28.571-1.28 1.282zm-7.94 1.282c-.7 0-1.28-.58-1.28-1.282 0-.711.57-1.282 1.28-1.282.71 0 1.28.571 1.28 1.282a1.29 1.29 0 01-1.28 1.282z"
                fill="url(#prefix__paint0_linear)"
              />
              <Defs>
                <LinearGradient
                  id="prefix__paint0_linear"
                  x1={0.526}
                  y1={10}
                  x2={20.526}
                  y2={10}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop stopColor="#069FC8" />
                  <Stop offset={1} stopColor="#7F2FDC" />
                </LinearGradient>
              </Defs>
            </Svg>
        )}
        {this.props.name == 'chat' && (
            <Svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 10.015C0 4.747 4.21 0 10.02 0 15.7 0 20 4.657 20 9.985 20 16.165 14.96 20 10 20c-1.64 0-3.46-.44-4.92-1.302-.51-.31-.94-.54-1.49-.36l-2.02.6c-.51.16-.97-.24-.82-.78l.67-2.244c.11-.31.09-.641-.07-.902C.49 13.43 0 11.697 0 10.015zm8.7 0c0 .711.57 1.282 1.28 1.292.71 0 1.28-.58 1.28-1.282 0-.711-.57-1.282-1.28-1.282-.7-.01-1.28.571-1.28 1.272zm4.61.01c0 .701.57 1.282 1.28 1.282.71 0 1.28-.58 1.28-1.282 0-.711-.57-1.282-1.28-1.282-.71 0-1.28.571-1.28 1.282zm-7.94 1.282c-.7 0-1.28-.58-1.28-1.282 0-.711.57-1.282 1.28-1.282.71 0 1.28.571 1.28 1.282a1.29 1.29 0 01-1.28 1.282z"
                fill="#557794"
              />
            </Svg>
        )}
        {this.props.name == 'profileSelected' && (
            <Svg
              width={16}
              height={20}
              viewBox="0 0 16 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.294 5.291A5.274 5.274 0 018 10.583a5.275 5.275 0 01-5.294-5.292A5.274 5.274 0 018 0a5.273 5.273 0 015.294 5.291zM8 20c-4.338 0-8-.705-8-3.425 0-2.721 3.685-3.401 8-3.401 4.339 0 8 .705 8 3.425C16 19.32 12.315 20 8 20z"
                fill="url(#prefix__paint0_linear)"
              />
              <Defs>
                <LinearGradient
                  id="prefix__paint0_linear"
                  x1={0.421}
                  y1={10}
                  x2={16.421}
                  y2={10}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop stopColor="#069FC8" />
                  <Stop offset={1} stopColor="#7F2FDC" />
                </LinearGradient>
              </Defs>
            </Svg>
        )}
        {this.props.name == 'profile' && (
            <Svg
              width={16}
              height={20}
              viewBox="0 0 16 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.294 5.291A5.274 5.274 0 018 10.583a5.275 5.275 0 01-5.294-5.292A5.274 5.274 0 018 0a5.273 5.273 0 015.294 5.291zM8 20c-4.338 0-8-.705-8-3.425 0-2.721 3.685-3.401 8-3.401 4.339 0 8 .705 8 3.425C16 19.32 12.315 20 8 20z"
                fill="#557794"
              />
            </Svg>
        )}
      </View>
    );
  }
}
navigationSvg.propTypes = {
  name: PropTypes.string.isRequired,
};
