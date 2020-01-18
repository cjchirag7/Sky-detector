import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Platform
} from 'react-native';
import { Input, CheckBox, Button, Icon } from 'react-native-elements';
// import { Camera, Asset } from 'expo';
import * as SecureStore from 'expo-secure-store';
import { createBottomTabNavigator } from 'react-navigation';
import { imageUrl } from '../shared/baseUrl';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
class LoginTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      name: '',
      focalLength: 0,
      height: 0,
      width: 0,
      remember: false
    };
  }

  componentDidMount() {
    SecureStore.getItemAsync('userinfo')
      .then(userdata => {
        let userinfo = JSON.parse(userdata);
        if (userinfo) {
          this.setState({ username: userinfo.username });
          this.setState({ password: userinfo.password });
          this.setState({ remember: true });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  static navigationOptions = {
    title: 'Login',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='sign-in'
        type='font-awesome'
        size={24}
        iconStyle={{ color: tintColor }}
      />
    )
  };

  handleLogin() {
    console.log(JSON.stringify(this.state));
    if (this.state.remember)
      SecureStore.setItemAsync(
        'userinfo',
        JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      ).catch(error => console.log('Could not save user info', error));
    else
      SecureStore.deleteItemAsync('userinfo').catch(error =>
        console.log('Could not delete user info', error)
      );
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Input
            placeholder='Username'
            //leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
            containerStyle={styles.formInput}
          />
          <Input
            placeholder='Password'
            //leftIcon={{ type: 'font-awesome', name: 'key' }}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            containerStyle={styles.formInput}
          />
          <CheckBox
            title='Remember Me'
            center
            checked={this.state.remember}
            onPress={() => this.setState({ remember: !this.state.remember })}
            containerStyle={styles.formCheckbox}
          />
          <View style={styles.formButton}>
            <Button
              onPress={() => this.handleLogin()}
              title='Login'
              icon={
                <Icon
                  name='sign-in'
                  type='font-awesome'
                  size={24}
                  color='white'
                />
              }
              buttonStyle={{
                backgroundColor: '#512DA8'
              }}
            />
          </View>
        </View>
        <View style={styles.formButton}>
          <Button
            onPress={() => this.props.navigation.navigate('Register')}
            title='Register'
            clear
            icon={
              <Icon
                name='user-plus'
                type='font-awesome'
                size={24}
                color='blue'
              />
            }
            titleStyle={{
              color: 'blue'
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

class RegisterTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      remember: false,
      imageUri: imageUrl + 'images/logo.png'
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
    title: 'Register',
    tabBarIcon: ({ tintColor, focused }) => (
      <Icon
        name='user-plus'
        type='font-awesome'
        size={24}
        iconStyle={{ color: tintColor }}
      />
    )
  };

  handleRegister() {
    console.log(JSON.stringify(this.state));
    if (this.state.remember)
      SecureStore.setItemAsync(
        'userinfo',
        JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      ).catch(error => console.log('Could not save user info', error));
  }

  render() {
    const { imageUri } = this.state;
    return (
      <ScrollView>
        <View style={styles.container}>
          {/* <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              loadingIndicatorSource={require('./images/logo.png')}
              style={styles.image}
            />
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
          </View> */}
          <Input
            placeholder='Username'
            //leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
            containerStyle={styles.formInput}
          />
          <Input
            placeholder='Password'
            //leftIcon={{ type: 'font-awesome', name: 'key' }}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            containerStyle={styles.formInput}
          />
          <Input
            placeholder='Name'
            //leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
            containerStyle={styles.formInput}
          />
          <Text style={styles.headline}>Camera Specifications</Text>
          <Input
            placeholder='Focal length (in mm)'
            //leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
            onChangeText={focalLength => this.setState({ focalLength })}
            value={this.state.focalLength}
            containerStyle={styles.formInput}
          />
          <Input
            placeholder='Height (in mm)'
            onChangeText={height => this.setState({ height })}
            value={this.state.height}
            containerStyle={styles.formInput}
          />
          <Input
            placeholder='Width (in mm)'
            onChangeText={width => this.setState({ width })}
            value={this.state.width}
            containerStyle={styles.formInput}
          />
          <CheckBox
            title='Remember Me'
            center
            checked={this.state.remember}
            onPress={() => this.setState({ remember: !this.state.remember })}
            containerStyle={styles.formCheckbox}
          />
          <View style={styles.formButton}>
            <Button
              onPress={() => this.handleRegister()}
              title='Register'
              icon={
                <Icon
                  name='user-plus'
                  type='font-awesome'
                  size={24}
                  color='white'
                />
              }
              buttonStyle={{
                backgroundColor: '#512DA8'
              }}
            />
          </View>
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
    width: 80,
    height: 60
  },
  buttons: {
    marginTop: 40
  },
  formInput: {
    margin: 20
  },
  formCheckbox: {
    margin: 20,
    backgroundColor: null
  },
  formButton: {
    margin: 60
  },
  headline: {
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 18,
    margin: 'auto'
  }
});

const Login = createBottomTabNavigator(
  {
    Login: LoginTab,
    Register: RegisterTab
  },
  {
    tabBarOptions: {
      activeBackgroundColor: '#9575CD',
      inactiveBackgroundColor: '#D1C4E9',
      activeTintColor: '#ffffff',
      inactiveTintColor: 'gray'
    }
  }
);

export default Login;
