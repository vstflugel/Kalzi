import React, { Component } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, FlatList, SafeAreaView } from 'react-native';
import ImageIcon from '../components/imageIcon';
import { Colors } from '../components/colors'

import { Weekdays } from './homeStack/home'
import Icon from 'react-native-vector-icons/Entypo'
import DefaultLoader from '../components/defaultLoader'
import InfoPopup from '../components/infoPopup'

import { connect } from 'react-redux'
import { GET_PARTICIPANTS } from '../redux/trainerRedux'

const screenWidth = Dimensions.get('window').width

class ViewParticipants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      participants: [],
      errorTitle: '',
      errorMessage: '',
      errorModalVisible: false,
      id: this.props.route.params.id,
      activeDay: this.props.route.params.activeDay,
      title: this.props.route.params.title,
      category: this.props.route.params.category,
      time: this.props.route.params.time,
      count: 0
    };
  }

  componentDidMount() {
      // console.log(this.state.id)
    // if (this.props.trainer[this.state.id] !== undefined) {
    //   console.log(this.props.trainer[this.state.id])
    //   this.setState({

    //     participants: this.props.trainer[this.state.id],
    //     count: this.props.trainer[this.state.id].length,
    //     loading: false

    //   })

    // }
    // else {

      fetch('https://us-central1-healer-fit-1.cloudfunctions.net/api/getParticipants', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: this.state.id,
        })
      })
        .then((res) => {
          return res.json()
        })
        .then((res) => {

          this.setState({

            participants: res,
            length: res.length,
            loading: false

          })
          // console.log('*****',res)
          this.props.dispatch({

            type: GET_PARTICIPANTS,
            payload: {
              id: this.state.id,
              participants: res
            }

          })

        })
        .catch((err) => {

          console.log("ERROR", err)

          this.setState({ loading: false })
          this.setState({ errorTitle: 'Error', errorMessage: 'Please go back and try again', errorModalVisible: true })

        })

    // }

  }

  render() {
    return (
      <SafeAreaView style={styles.parentContainer}>
        <View style={styles.parentContainer}>
        <DefaultLoader
          modalVisible={this.state.loading}
        />
        <InfoPopup
          title={this.state.errorTitle}
          subTitle={this.state.errorMessage}
          okButton={() => {
            this.setState({ errorModalVisible: false })
          }}
          setEqualSpace={15}
          modalVisible={this.state.errorModalVisible}
          okText="OK"
        />
        <Icon
          name="chevron-thin-left"
          size={30}
          color={Colors.textPlaceholder}
          style={{ marginTop: 20, marginLeft:-2}}
          onPress={() => this.props.navigation.navigate('Sessions')}
        />
        <FlatList
          ListHeaderComponent={
            <View style={{ marginBottom: 10 ,  }}>
              <View style={styles.topBarContainer}>
                <View style={{ marginBottom: 20 }} >
                  <Text style={styles.text}>View </Text>
                  <Text style={styles.username}>Participants </Text>
                </View>
                <ImageIcon source={{ uri: this.props.user.user.photoUrl }} height={70} width={70} borderRadius={35} />
              </View>
              <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, marginBottom: 10 }}>{this.state.time}</Text>
              <Weekdays left={true} width={screenWidth * 0.63} activeDay={this.state.activeDay} />
              {this.state.count !== 0 && <Text style={styles.topicText}>{this.state.category} : Total : {this.state.count.toString()}</Text>}
            </View>

          }
          data={this.state.participants}
          keyExtractor={item => item.uid}
          renderItem={({ item }) => {

            return (
              <Pressable onPress={() => {
                // console.log("YOO")
                this.props.navigation.navigate('ViewHealth', {item: item})
                // console.log("YO")
              }} >
                <View style={{ marginBottom: 15, flexDirection: 'row', marginHorizontal: 10, backgroundColor: 'black', paddingHorizontal: 10, paddingVertical: 10, borderColor: Colors.boxBorder, borderWidth: 2, borderRadius: 20, }}>
                  <ImageIcon onPress={this.props.onPress} source={{ uri: item.photoUrl }} height={45} width={45} borderRadius={22.5} />
                  {item.injury === '' && <Text style={{ color: 'green', fontWeight: 'bold', alignSelf: 'center', marginLeft: 35, fontSize: 25, flex: 3 }}>{item.name}</Text>}
                  {item.injury !== '' && <Text style={{ color: 'red', fontWeight: 'bold', alignSelf: 'center', marginLeft: 35, fontSize: 25, flex: 3 }}>{item.name}</Text>}
                  <Icon size={20} name='chevron-thin-right' style={{ alignSelf: 'center', marginRight: 20 }} color={Colors.textPlaceholder} />
                </View>
              </Pressable>
            )

          }}
        />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return (
    {
      user: state.user,
      trainer: state.trainer
    }
  )
}
export default connect(mapStateToProps)(ViewParticipants)

class TrainerProfile extends Component {
  render() {
    return (
      <Pressable onPress={this.props.onPress} style={styles.trainerContainer}>
        <View>
          <ImageIcon onPress={this.props.onPress} source={{ uri: this.props.profilePic }} height={0.25 * screenWidth} width={0.25 * screenWidth} borderRadius={0.125 * screenWidth} />
          <View style={styles.label}>
            <Text style={styles.labelText}>{this.props.type}</Text>
          </View>
        </View>
        <Text style={styles.trainerText}>{this.props.trainerName}</Text>
      </Pressable>
    )
  };
}
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
    justifyContent: 'space-between'
  },
  text: {
    color: Colors.white,
    fontSize: 20,
    marginTop: 10
  },
  username: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 30
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
    fontWeight: 'bold'
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
    marginRight: screenWidth * 0.05
  }
})
