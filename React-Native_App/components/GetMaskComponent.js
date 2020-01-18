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

class GetMask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: 'https://via.placeholder.com/320'
    };
  }
  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  getImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.cancelled) {
      console.log(result);
      this.processImage(result.localUri || result.uri);
    }
  };

  getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (
      cameraPermission.status === 'granted' &&
      cameraRollPermission.status === 'granted'
    ) {
      let capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });
      if (!capturedImage.cancelled) {
        console.log(capturedImage);
        this.processImage(capturedImage.localUri || capturedImage.uri);
      }
    }
  };

  processImage = async imageUri => {
    let processedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 400 } }],
      { format: 'png' }
    );
    console.log(processedImage);
    this.setState({ imageUri: processedImage.uri });
  };

  static navigationOptions = {
    title: 'GetMask Us'
  };
  render() {
    const { imageUri } = this.state;
    const { navigate } = this.props.navigation;

    return (
      <ScrollView>
        {/* <View style={styles.container}>
         */}
        {/* <Button
            title='Camera'
            onPress={this.getImageFromCamera}
            style={styles.buttons}
          />
          <Button
            icon={<Icon name='arrow-right' size={15} color='white' />}
            title='Gallery'
            onPress={this.getImageFromGallery}
          /> */}
        <View style={styles.headContainer}>
          <Icon
            raised
            reverse
            type='font-awesome'
            name={'camera'}
            color='#36A0ED'
            onPress={this.getImageFromCamera}
          />

          <Icon
            raised
            reverse
            type='font-awesome'
            name={'image'}
            color='#36A0ED'
            onPress={this.getImageFromGallery}
          />
        </View>

        <View style={styles.headContainer}>
          <Image
            source={{ uri: imageUri }}
            loadingIndicatorSource={require('./images/logo.png')}
            style={styles.image}
          />
        </View>
        <View style={{ marginTop: 35 }}>
          <Button
            title='View Mask'
            onPress={() => navigate('ViewMask', { mask: imageUri })}
            style={styles.buttons}
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
  headContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    padding: 20
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  image: {
    margin: 'auto',
    width: 320,
    height: 256
  },
  buttons: {
    paddingTop: 20,
    marginLeft: 10,
    marginRight: 10,
    width: 'auto',
    color: 'blue'
  }
});

export default GetMask;
