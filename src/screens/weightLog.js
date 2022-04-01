import React, { Component } from 'react';
import { LineChart } from "react-native-chart-kit";

import { View, Text, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';

import { Colors } from '../components/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// import { connect } from 'react-redux'


const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const user_info = [{
  Date: 'Nov',
  Weight: 100,
  BMI: 29.9
},{
  Date: 'Dec',
  Weight: 95,
  BMI: 28.4
},{
  Date: 'Jan',
  Weight: 94,
  BMI: 28.1
},{
  Date: 'Feb',
  Weight: 95,
  BMI: 28.4
},{
  Date: 'Mar',
  Weight: 96,
  BMI: 28.7
}];

var weight = [];
var date = [];

user_info.map( (object) => {
  weight.push(object.Weight),
  date.push(object.Date)
})

// const data = {
//   labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Nov", "Dec", "Jan", "Feb", "Mar", "Nov", "Dec", "Jan", "Feb", "Mar", "Nov", "Dec", "Jan", "Feb", "Mar"],
//   datasets: [
//     {
//       data: [
//         100, 95, 94, 95, 96, 100, 95, 94, 95, 96, 100, 95, 94, 
//         95, 96, 100, 95, 94, 95, 96
//       ]
//     }
//   ]
// };

const data = {
  labels: date,
  datasets: [
    {data: weight}
  ]
};

class home extends Component {


  render() {

    return (
      // <SafeAreaView style={styles.parentContainer}>

      <KeyboardAwareScrollView style={styles.parentContainer}>

        <Text style={{ color: Colors.white, marginBottom: 20, fontWeight: 'bold', fontSize: 25, alignSelf: 'flex-start', paddingHorizontal: 10 , marginTop: 30 }}>Weight Log</Text>

        <View>
        <ScrollView horizontal={true}> 
          <LineChart
            data={data}
            //width={Dimensions.get("window").width} // from react-native
            width={screenWidth * date.length/5}
            height={screenHeight/1.5}
            //yAxisLabel="$"
            yAxisSuffix=" kg"
            yAxisInterval={1} // optional, defaults to 1
            
            chartConfig={{
              backgroundColor: "#AA336A",
              backgroundGradientFrom: "#00008B",
              backgroundGradientTo: "#AA336A",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `#AA336A`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
            onDataPointClick={ ({ value }) =>{ 
              Alert.alert(
                "Your Weight is: ",
                value + " Kg",
                [{text: 'Cancel'}])
            }
            }
          />
          </ScrollView>
         
        </View>
      
      </KeyboardAwareScrollView>
      // </SafeAreaView>
    );
  }

}

export default home

const styles = StyleSheet.create({
  parentContainer: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingHorizontal: 20
  },
})
