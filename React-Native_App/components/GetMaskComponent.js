import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  View,
  Text,
  Alert
} from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { baseUrl, imageUrl } from '../shared/baseUrl';
import * as SecureStore from 'expo-secure-store';

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
      aspect: [5, 4],
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
        aspect: [5, 4]
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
      [{ resize: { width: 320 } }],
      { format: 'jpeg' }
    );
    console.log(processedImage);
    this.setState({ imageUri: processedImage.uri });
  };

  viewMask() {
    const { navigate } = this.props.navigation;
    const { imageUri } = this.state;
    let filename = imageUri.split('/').pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    SecureStore.getItemAsync('userStatus')
      .then(userstat => {
        let userStatus = JSON.parse(userstat);
        if (userStatus.loggedIn) {
          SecureStore.getItemAsync('userinfo')
            .then(userdata => {
              let userinfo = JSON.parse(userdata);
              let username = userinfo.username;
              // Upload the image using the fetch and FormData APIs
              let formData = new FormData();
              // Assume "photo" is the name of the form field the server expects
              formData.append('image', { uri: imageUri, name: filename, type });
              formData.append('username', username);
              return fetch(`${baseUrl}get_mask`, {
                method: 'POST',
                body: formData,
                header: {
                  'content-type': 'multipart/form-data'
                },
                credentials: 'same-origin'
              })
                .then(
                  response => {
                    if (response.ok) {
                      return response;
                    }

                    const error = new Error(
                      `Error ${response.status}: ${response.statusText}`
                    );
                    error.response = response;
                    throw error;
                  },
                  error => {
                    const errmess = new Error(error.message);
                    throw errmess;
                  }
                )
                .then(response => response.json())
                .then(response => {
                  const { mask, angles, percent, image, error } = response;
                  if (error) {
                    Alert.alert('Image not uploaded properly.');
                    return;
                  }
                  return navigate('ViewMask', {
                    mask: mask,
                    angles: angles,
                    percent: percent,
                    image: image
                  });
                })
                .catch(error => {
                  console.log(error.message);
                  Alert.alert(error.message);
                });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          Alert.alert('Please log in to avail this facility.');
          return;
        }
      })
      .catch(error => {
        Alert.alert(error);
      });
  }

  static navigationOptions = {
    title: 'GetMask Us'
  };
  render() {
    const { imageUri } = this.state;
    const { navigate } = this.props.navigation;

    return (
      <ScrollView>
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
            onPress={() => {
              this.viewMask();
            }}
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
    height: 256,
    margin: 'auto'
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
