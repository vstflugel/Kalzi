import React, { Component } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, Image, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import ImageIcon from '../components/imageIcon';
import { Colors } from '../components/colors'
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../components/gradientButton';
import { Weekdays } from './homeStack/home'
import Icon from 'react-native-vector-icons/Entypo'
import DefaultLoader from '../components/defaultLoader'
import InfoPopup from '../components/infoPopup'
import { connect } from 'react-redux'
import { SearchBar } from 'react-native-elements';
import { GET_PARTICIPANTS } from '../redux/trainerRedux'

const screenWidth = Dimensions.get('window').width

const Badge = ({ count }) => (
  <View style={circlestyles.circle}>

    <Text style={{ textAlignVertical: "center", textAlign: "center", color: '#FFF' }}>{count}</Text>

  </View>
);

// Note=Search bar hasn't implemented yet
// Variables like participants are redundant
class MultipleChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      participants: [],
      length: 0,
      errorTitle: '',
      errorMessage: '',
      errorModalVisible: false,
      id: "",
      activeDay: '',
      title: '',
      category: '',
      time: '',
      count: 0,
      isLiveWorkout: true,
      SearchQuery: "",
    };
  }



  Show_Live_Workout = () => {
    return (<View style={{ marginBottom: 30, marginLeft: 12, flexDirection: "row", alignItems: "center" }} >
      <Text style={styles.username}>check</Text>


    </View>)
  }

  Show_Training_Plan = () => {
    return (<View style={{ marginBottom: 30, marginLeft: 12, flexDirection: "row", alignItems: "center" }} >
      <Text style={styles.username}>sample</Text>


    </View>)


  }

  componentDidMount() {
    // if (this.props.trainer[this.state.id] !== undefined) {
    //   this.setState({
    //     participants: this.props.trainer[this.state.id],
    //     count: this.props.trainer[this.state.id].length,
    //     loading: false
    //   })
    // }
   // fetch('https://us-central1-healer-fit-1.cloudfunctions.net/api/getParticipants', {
   //     method: 'POST',
   //     headers: {
   //       Accept: 'application/json',
   //       'Content-Type': 'application/json'
   //     },
   //     body: JSON.stringify({
   //       id: this.state.id,
   //     })
   //   })
   //     .then((res) => {
   //       return res.json()
   //     })
   //     .then((res) => {

   //       this.setState({

   //         participants: res,
   //         length: res.length,
   //         loading: false

   //       })
   //       // console.log('*****',res)
   //       this.props.dispatch({

   //         type: GET_PARTICIPANTS,
   //         payload: {
   //           id: this.state.id,
   //           participants: res
   //         }

   //       })

   //     })
   //     .catch((err) => {

   //       console.log("ERROR", err)

   //       this.setState({ loading: false })
   //       this.setState({ errorTitle: 'Error', errorMessage: 'Please go back and try again', errorModalVisible: true })

   //     })
   // console.log(this.state.participants)
  }

  render() {
    return (
      <SafeAreaView style={styles.parentContainer}>

        <View style={{ paddingHorizontal: 20  }}>
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
          
          <FlatList
            ListHeaderComponent={
              <View style={{ marginBottom: 10 }}>
                <View style={styles.topBarContainer}>
                  <View style={{ marginBottom: 50 }} >
                    <Text style={styles.username}>Chatrooms</Text>
                  </View>
                </View>
              </View>
              ////
            }
            

            data={this.props.user.user.sessions}
            keyExtractor={item => item}
            renderItem={({ item }) => {

              var dt = new Date(this.props.user.sessions[item]['time'])
              var hours = dt.getHours()
              var minutes = dt.getMinutes()
              if (hours > 11) {
                if (minutes < 10) {
                  dt = `${+hours - 12}:0${minutes} PM`
                }
                else {
                  dt = `${+hours - 12}:${minutes} PM`
                }
              }
              else {
                if (minutes < 10) {
                  dt = `${hours}:0${minutes} AM`
                }
                else {
                  dt = `${hours}:${minutes} AM`
                }
              }

                // var lastMessageTime = new Date(this.props.user.sessions[item]['lastCreatedAt'])
                // var hours = lastMessageTime.getHours()
                // var minutes = lastMessageTime.getMinutes()
                // if (hours > 11) {
                //   if (minutes < 10) {
                //     lastMessageTime = `${+hours - 12}:0${minutes} PM`
                //   }
                //   else {
                //     lastMessageTime = `${+hours - 12}:${minutes} PM`
                //   }
                // }
                // else {
                //   if (minutes < 10) {
                //     lastMessageTime = `${hours}:0${minutes} AM`
                //   }
                //   else {
                //     lastMessageTime = `${hours}:${minutes} AM`
                //   }
                // }

                // var lastMessage = this.props.user.sessions[item]['lastMessage']

                // if(this.props.user.sessions[item]['lastMessage'].length > 10) {
                //   lastMessage = str.substring(0, 9) + '...'
                // }

              return (
                <Pressable onPress={() => {
                  this.props.navigation.navigate('ChatHome', { id: item })
                }} >
                  <View style={{ marginBottom: 30, marginLeft: 12, flexDirection: "row", alignItems: "center" }} >
<View style={{ flex: 0.9 }} >
                      <GradientButton flex={10} flexDirection={"column"} height={40} width={screenWidth * 0.3} borderRadius={15} text='Groups'
                        onPress={() => {
                          this.setState({ isLiveWorkout: true });
}}
                      />
                    </View>
<GradientButton height={40} width={screenWidth * 0.3} borderRadius={15} text='DMs'
                      onPress={() => {
                        this.setState({ isLiveWorkout: false });
                      }}

                    />
</View>

                  {this.state.isLiveWorkout ? <View style={{ marginBottom: 15, flexDirection: 'row', marginHorizontal: 10, backgroundColor: 'black', paddingHorizontal: 10, paddingVertical: 10, borderColor: Colors.boxBorder, borderWidth: 2, borderRadius: 20, }}>
                    <View style={{ flex: 3, justifyContent: 'center', }} >
                      <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '90%' }} >
                        <Text style={{ color: Colors.white, fontWeight: 'bold', alignSelf: 'center', fontSize: 20, }}>{this.props.user.sessions[item]['category']}</Text>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, marginTop: 15, marginBottom: 10 }}>⏲️ {dt}</Text>
                        {/* <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, marginTop: 15, marginBottom: 10 }}>🧘🏽‍♀️ {this.props.user.sessions[item]['filledSpots']}</Text> */}
                      </View>
                      <View style={{ marginBottom: 3 }}>
                        <Weekdays left={true} width={screenWidth * 0.63} activeDay={this.props.user.sessions[item]['activeDay']} />
                      </View>
                      <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '90%', borderTopColor: Colors.boxBorder, borderWidth: 1, marginTop: 3 }} >
                        {/* <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, marginTop: 15, marginBottom: 10 }}>{lastMessage}</Text> */}
                        {/* <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15, marginTop: 15, marginBottom: 10 }}> {lastMessageTime}</Text> */}
                        {this.props.user.user.unread[item] > 0 && <Text style={{ color: Colors.gradientRight, fontWeight: 'bold', fontSize: 15, marginTop: 15, marginBottom: 10 }}> {this.props.user.user.unread[item]} unread</Text>}
                      </View>
                    </View>
                    <Icon size={20} name='chevron-thin-right' style={{ alignSelf: 'center', marginRight: 20 }} color={Colors.textPlaceholder} />

                    </View> : <Pressable onPress={() => { 
                      // console.log("YOO")
                      //this.props.navigation.navigate('ViewHealth', {item: item})
                      // console.log("YO")
                    }} >

                      {/* Search Bar, returns a SearchQuery */}
                      <View style={{ marginBottom: 15 }}>
                        <View style={{ backgroundColor: 'green' }}>
                          <SearchBar
                            placeholder="Search Participants"
                            onChangeText={query => this.setState({SearchQuery: query})}
                            value={this.state.SearchQuery}
                            lightTheme={false}
                            placeholderTextColor={'green'}
                            onCancel={() => this.setState({SearchQuery: ""})}
                          />
                        </View>
                      </View>

                    </Pressable>} 
                </Pressable>
              )
            }}
          />
        </View>
              
        <View >
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
          {/* .toLowerCase().startsWith(SearchQuery) */}
          <FlatList
            data={(this.props.user.user.sessions)}
            keyExtractor={item => item}
            renderItem={({ item }) => {

              
              // var lastMessageTime = new Date(this.props.user.sessions[item]['lastCreatedAt'])
              // var hours = lastMessageTime.getHours()
              // var minutes = lastMessageTime.getMinutes()
              // if (hours > 11) {
              //   if (minutes < 10) {
              //     lastMessageTime = `${+hours - 12}:0${minutes} PM`
              //   }
              //   else {
              //     lastMessageTime = `${+hours - 12}:${minutes} PM`
              //   }
              // }
              // else {
              //   if (minutes < 10) {
              //     lastMessageTime = `${hours}:0${minutes} AM`
              //   }
              //   else {
              //     lastMessageTime = `${hours}:${minutes} AM`
              //   }
              // }

              // var lastMessage = this.props.user.sessions[item]['lastMessage']

              // if(this.props.user.sessions[item]['lastMessage'].length > 10) {
              //   lastMessage = str.substring(0, 9) + '...'
              // }

              return (
                  <Pressable >
                    {this.state.isLiveWorkout ? <View style={{ marginBottom: 15, flexDirection: 'row', marginHorizontal: 10, backgroundColor: 'black', paddingHorizontal: 10, paddingVertical: 10, borderColor: Colors.boxBorder, borderWidth: 2, borderRadius: 20, }}>
                      <Icon size={20} name='chevron-thin-right' style={{ alignSelf: 'center', marginRight: 20 }} color={Colors.textPlaceholder} />
                    </View> : <Pressable onPress={() => {
                      // console.log("YOO")
                      //this.props.navigation.navigate('ViewHealth', {item: item})
                      // console.log("YO")
                    }} >
          
                    {/* <FlatList
                      // Change data here according to name, these are UID's
                      data = {( (this.props.user.sessions[item]['members']).filter(ele => ele.toLowerCase().startsWith(this.state.SearchQuery.toLowerCase())) )}
                      keyExtractor = { item => item.id}
                      renderItem = { ({UserName,index}) => {
                        // {console.log({UserName})}
                        // {console.log({index})}
                        return (
                          <View key={index} style={{ marginTop: 30, marginBottom: 0, flexDirection: 'row', marginHorizontal: 0, paddingHorizontal: 0, paddingVertical: 10  }}>
                            <ImageIcon onPress={this.props.onPress} source={{ uri: item.photoUrl }} height={45} width={45} borderRadius={22.5} />
                            <Badge count={4} />
                            {<Text style={{ color: 'white', fontWeight: 'bold', alignSelf: 'center', marginLeft: 35, fontSize: 25, flex: 3 }}>{UserName}</Text>}
                          </View>
                        );
                      }}
                    />   */}

                   // <ScrollView>
                   // {(this.state.participants.filter(ele => ele.toLowerCase().startsWith(this.state.SearchQuery.toLowerCase()))).map ( (UserName,i) => {
                   //   return(
                   //     <View key={i} style={{ marginTop: 30, marginBottom: 0, flexDirection: 'row', marginHorizontal: 0, paddingHorizontal: 0, paddingVertical: 10  }}>
                   //       <ImageIcon onPress={this.props.onPress} source={{ uri: item.photoUrl }} height={45} width={45} borderRadius={22.5} />
                   //       <Badge count={4} />
                   //       {<Text style={{ color: 'white', fontWeight: 'bold', alignSelf: 'center', marginLeft: 35, fontSize: 25, flex: 3 }}>{UserName}</Text>}
                   //     </View>
                   //   );
                   // })}
                   // </ScrollView>

                    </Pressable>}
                  </Pressable>
              );
            }}
          />

        </View>

        {/* Don't know what below is meant for, Its not needed so I am commenting it out inside*/}
        <View>
        {/* <View>
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
          <FlatList
            
          data={this.props.user.user.sessions}
          keyExtractor={item => item}
          
          renderItem={({ item }) => {
            return(
            <View style={{ marginBottom: 0, flexDirection: 'row', marginHorizontal: 0, paddingHorizontal: 0, paddingVertical: 10 }}>
              <ImageIcon onPress={this.props.onPress} source={{ uri: item.photoUrl }} height={45} width={45} borderRadius={22.5} />
              <Badge count={4} />
              {<Text style={{ color: 'white', fontWeight: 'bold', alignSelf: 'center', marginLeft: 35, fontSize: 25, flex: 3 }}>__Name__</Text>}
            </View>
            );
          }}
          />
          
          </View>
       */}
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

export default connect(mapStateToProps)(MultipleChat)

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
    paddingHorizontal: 20
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

const circlestyles = StyleSheet.create({
  circle: {
    width: 22,
    height: 22,
    borderRadius: 18,
    backgroundColor: 'purple',

  },
  count: { color: '#FFF' }
})
