import React, { Component } from 'react';
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

    return (
      <ScrollView>
        <View>
          <Image
            source={{ uri: imageUri }}
            loadingIndicatorSource={require('./images/logo.png')}
            style={styles.image}
          />
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
