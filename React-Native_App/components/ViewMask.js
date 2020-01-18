import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  View,
  Text
} from 'react-native';
import { LineChart, Grid, YAxis } from 'react-native-svg-charts';
import { Card, Button, Icon } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

class ViewMask extends Component {
  constructor(props) {
    super(props);
    const mask = this.props.navigation.getParam('mask');
    this.state = {
      imageUri: mask
    };
  }

  render() {
    const { imageUri } = this.state;
    let data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80];
    const contentInset = { top: 20, bottom: 20 };
    return (
      <ScrollView>
        <View>
          <Image
            source={{ uri: imageUri }}
            loadingIndicatorSource={require('./images/logo.png')}
            style={styles.image}
          />
        </View>
        <View style={{ height: 200, flexDirection: 'row' }}>
          <YAxis
            data={data}
            contentInset={contentInset}
            svg={{
              fill: 'grey',
              fontSize: 10
            }}
            numberOfTicks={12}
            formatLabel={value => `${value}º`}
          />
          <LineChart
            style={{ flex: 1, marginLeft: 8 }}
            data={data}
            svg={{ stroke: 'rgb(134, 65, 244)' }}
            contentInset={contentInset}
          >
            <Grid />
          </LineChart>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    margin: 20
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  image: {
    margin: 10,
    width: 320,
    height: 256
  },
  buttons: {
    marginTop: 40
  }
});

export default ViewMask;
