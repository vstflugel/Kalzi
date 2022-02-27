import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    SafeAreaView
} from 'react-native';
import { Colors } from '../components/colors';
import Feather from 'react-native-vector-icons/Feather';
import DefaultLoader from '../components/defaultLoader'
import InfoPopup from '../components/infoPopup'
import { WebView } from 'react-native-webview'

export default class WebViewScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.props.route.params.url,
            loading: true,
            errorTitle: '',
            errorMessage: '',
            errorModalVisible: false,
        };
    }

    componentDidMount() {
        console.log("URL", this.state.url)
    }

    render() {

        return (

            <SafeAreaView style={{ backgroundColor: Colors.background, flex: 1 }}>
                <DefaultLoader
                    modalVisible={this.state.loading}
                />
                <InfoPopup
                    title={this.state.errorTitle}
                    subTitle={this.state.errorMessage}
                    okButton={() => {
                        this.setState({ errorModalVisible: false });  //On pressing OK or Cancel the popup should eventually disappear.
                    }}
                    setEqualSpace={15}       //This is to set margins equal in the Cancel/OK View.
                    modalVisible={this.state.errorModalVisible}
                    okText="OK"
                />
                <View style={styles.topBar}>
                    <Feather
                        name="chevron-left"
                        size={40}
                        color={Colors.textPlaceholder}
                        style={styles.backButton}
                        onPress={() => this.props.navigation.goBack()}
                    />
                    <View style={styles.blobText}>
                        <Text style={styles.signUp}>Joining Instructions</Text>
                        <Text style={styles.signUpCaption}></Text>
                    </View>
                </View>
                <WebView
                    onLoadStart={() => {
                        this.setState({ loading: true })
                    }}
                    onLoadEnd={() => {
                        this.setState({ loading: false })
                    }}
                    onError={() => {

                        this.setState({ loading: false })
                        this.setState({ errorTitle: 'Whoops', errorMessage: 'There was a problem while fetching instructions', errorModalVisible: true })

                    }}
                    source={{ uri: this.state.url }}
                    style={{ flex: 1, marginHorizontal: 10, backgroundColor: Colors.background }}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    backButton: { marginTop: 15, marginLeft: 15 },
    blobText: {
        position: 'absolute',
        top: 15,
        right: 15,
        alignItems: 'flex-end',
    },
    signUp: {
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
        color: Colors.white,
    },
    signUpCaption: {
        fontSize: 15,
        color: Colors.white,
    },
    gradientButton: {
        alignSelf: 'center',
        marginTop: 20,
    },
    dontHave: {
        color: Colors.textPlaceholder,
        alignSelf: 'center',
        marginTop: 10,
    },
    logIn: {
        color: Colors.error,
        fontFamily: 'Roboto-Bold',
    },
    or: {
        color: Colors.textPlaceholder,
        alignSelf: 'center',
        marginVertical: 30,
    },
});

