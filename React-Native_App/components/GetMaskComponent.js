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

const sampleImage =
  'https://www.google.com/imgres?imgurl=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F912110%2Fpexels-photo-912110.jpeg%3Fauto%3Dcompress%26cs%3Dtinysrgb%26dpr%3D1%26w%3D500&imgrefurl=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fsky%2F&docid=pZ56kUO_51Z65M&tbnid=bpNcK9O3qS9JIM%3A&vet=10ahUKEwj9xo_Bj4vnAhW64nMBHVEaCC8QMwhjKAAwAA..i&w=500&h=333&bih=669&biw=1366&q=sky%20jpg%20image&ved=0ahUKEwj9xo_Bj4vnAhW64nMBHVEaCC8QMwhjKAAwAA&iact=mrc&uact=8';
class GetMask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: sampleImage
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
        <View style={styles.container}>
          <Button
            title='Camera'
            onPress={this.getImageFromCamera}
            style={styles.buttons}
          />
          <Button
            title='Gallery'
            onPress={this.getImageFromGallery}
            style={styles.buttons}
          />
        </View>
        <View>
          <Image
            source={{ uri: imageUri }}
            loadingIndicatorSource={require('./images/logo.png')}
            style={styles.image}
          />
        </View>
        <View>
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

export default GetMask;
