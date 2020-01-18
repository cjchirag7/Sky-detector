import React, { Component } from 'react';
import { LineChart, Grid } from 'react-native-svg-charts';
import {
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  View,
  Text
} from 'react-native';
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
    return (
      <ScrollView>
        <View>
          <Image
            source={{ uri: imageUri }}
            loadingIndicatorSource={require('./images/logo.png')}
            style={styles.image}
          />
        </View>

        <View>
          <LineChart
            style={{ height: 200 }}
            data={data}
            svg={{ stroke: 'rgb(134, 65, 244)' }}
            contentInset={{ top: 20, bottom: 20 }}
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
  },
  headline: {
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 18,
    margin: 'auto'
  }
});

export default ViewMask;
