import React, { Component } from 'react';
import {
  View,
  Platform,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  NetInfo,
  ToastAndroid
} from 'react-native';
import {
  createStackNavigator,
  createDrawerNavigator,
  DrawerItems,
  SafeAreaView
} from 'react-navigation';
import { Icon } from 'react-native-elements';
// import { connect } from 'react-redux';
import HistoryDetail from './HistoryDetailComponent';
import Login from './LoginComponent';
// import {
//   fetchComments,
//   fetchDishes,
//   fetchLeaders,
//   fetchPromos
// } from '../redux/ActionCreators';
import History from './HistoryComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import GetMask from './GetMaskComponent';
import ViewMask from './ViewMask';
// import Favorites from './FavoriteComponent';

// const mapStateToProps = state => {
//   return {
//     dishes: state.dishes,
//     comments: state.comments,
//     promotions: state.promotions,
//     leaders: state.leaders
//   };
// };

// const mapDispatchToProps = dispatch => ({
//   fetchDishes: () => dispatch(fetchDishes()),
//   fetchComments: () => dispatch(fetchComments()),
//   fetchPromos: () => dispatch(fetchPromos()),
//   fetchLeaders: () => dispatch(fetchLeaders())
// });

const HomeNavigator = createStackNavigator(
  {
    Home: { screen: props => <Home {...{ props }} /> }
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#512DA8'
      },
      headerTitle: 'Home',
      headerTintColor: '#fff',
      headerTitleStyle: {
        color: '#fff'
      },
      headerLeft: (
        <Icon
          name='menu'
          size={24}
          color='white'
          containerStyle={{ paddingLeft: 10 }}
          onPress={() => navigation.toggleDrawer()}
        />
      )
    })
  }
);

const GetMaskNavigator = createStackNavigator(
  {
    GetMask: {
      screen: props => <GetMask {...props} />,
      navigationOptions: ({ navigation }) => ({
        headerLeft: (
          <Icon
            name='menu'
            size={24}
            color='white'
            containerStyle={{ paddingLeft: 10 }}
            onPress={() => navigation.toggleDrawer()}
          />
        )
      })
    },
    ViewMask: { screen: props => <ViewMask {...props} /> }
  },
  {
    initialRouteName: 'GetMask',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#512DA8'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        color: '#fff'
      },
      headerTitle: 'Get Mask'
    }
  }
);

const HistoryNavigator = createStackNavigator(
  {
    History: {
      screen: props => <History {...props} />,
      navigationOptions: ({ navigation }) => ({
        headerLeft: (
          <Icon
            name='menu'
            size={24}
            color='white'
            containerStyle={{ paddingLeft: 10 }}
            onPress={() => navigation.toggleDrawer()}
          />
        )
      })
    },
    HistoryDetail: { screen: props => <HistoryDetail {...props} /> }
  },
  {
    initialRouteName: 'History',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#512DA8'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        color: '#fff'
      },
      headerTitle: 'History'
    }
  }
);

const ContactNavigator = createStackNavigator(
  {
    Contact: { screen: Contact }
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#512DA8'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        color: '#fff'
      },
      headerLeft: (
        <Icon
          name='menu'
          size={24}
          color='white'
          containerStyle={{ paddingLeft: 10 }}
          onPress={() => navigation.toggleDrawer()}
        />
      )
    })
  }
);

const LoginNavigator = createStackNavigator(
  {
    Login: Login
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#512DA8'
      },
      headerTitleStyle: {
        color: '#fff'
      },
      title: 'Login',
      headerTintColor: '#fff',
      headerLeft: (
        <Icon
          name='menu'
          size={24}
          iconStyle={{ color: 'white' }}
          onPress={() => navigation.toggleDrawer()}
        />
      )
    })
  }
);

const CustomDrawerComponent = props => (
  <ScrollView>
    <SafeAreaView
      style={styles.container}
      forceInset={{ top: 'always', horizontal: 'never' }}
    >
      <View style={styles.drawerHeader}>
        <View style={{ flex: 1 }}>
          <Image
            source={require('./images/logo.png')}
            style={styles.drawerImage}
          />
        </View>
        <View style={{ flex: 2 }}>
          <Text style={styles.drawerHeaderText}>Sky Detector</Text>
        </View>
      </View>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);
const MainNavigator = createDrawerNavigator(
  {
    Login: {
      screen: LoginNavigator,
      navigationOptions: {
        title: 'Login',
        drawerLabel: 'Login',
        drawerIcon: ({ tintColor, focused }) => (
          <Icon
            name='sign-in'
            type='font-awesome'
            size={24}
            iconStyle={{ color: tintColor }}
          />
        )
      }
    },
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        title: 'Home',
        drawerLabel: 'Home',
        drawerIcon: ({ tintColor, focused }) => (
          <Icon name='home' type='font-awesome' size={24} color={tintColor} />
        )
      }
    },
    GetMask: {
      screen: GetMaskNavigator,
      navigationOptions: {
        title: 'Get Mask',
        drawerLabel: 'Get Mask',
        drawerIcon: ({ tintColor, focused }) => (
          <Icon
            name='file-image-o'
            type='font-awesome'
            size={20}
            color={tintColor}
          />
        )
      }
    },
    History: {
      screen: HistoryNavigator,
      navigationOptions: {
        title: 'My History',
        drawerLabel: 'History',
        drawerIcon: ({ tintColor, focused }) => (
          <Icon
            name='history'
            type='font-awesome'
            size={20}
            color={tintColor}
          />
        )
      }
    },
    Contact: {
      screen: ContactNavigator,
      navigationOptions: {
        title: 'Contact Us',
        drawerLabel: 'Contact Us',
        drawerIcon: ({ tintColor, focused }) => (
          <Icon
            name='address-card'
            type='font-awesome'
            size={24}
            color={tintColor}
          />
        )
      }
    }
  },
  {
    initialRouteName: 'Home',
    drawerBackgroundColor: '#D1C4E9',
    contentComponent: CustomDrawerComponent
  }
);

class Main extends Component {
  componentDidMount() {
    // this.props.fetchDishes();
    // this.props.fetchComments();
    // this.props.fetchPromos();
    // this.props.fetchLeaders();

    NetInfo.getConnectionInfo().then(connectionInfo => {
      ToastAndroid.show(
        'Initial Network Connectivity Type: ' +
          connectionInfo.type +
          ', effectiveType: ' +
          connectionInfo.effectiveType,
        ToastAndroid.LONG
      );
    });

    NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );
  }

  handleConnectivityChange = connectionInfo => {
    switch (connectionInfo.type) {
      case 'none':
        ToastAndroid.show('You are now offline!', ToastAndroid.LONG);
        break;
      case 'wifi':
        ToastAndroid.show('You are now connected to WiFi!', ToastAndroid.LONG);
        break;
      case 'cellular':
        ToastAndroid.show(
          'You are now connected to Cellular!',
          ToastAndroid.LONG
        );
        break;
      case 'unknown':
        ToastAndroid.show(
          'You now have unknown connection!',
          ToastAndroid.LONG
        );
        break;
      default:
        break;
    }
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'purple',
          paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight
        }}
      >
        <MainNavigator />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  drawerHeader: {
    backgroundColor: '#512DA8',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  drawerHeaderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  drawerImage: {
    margin: 10,
    width: 80,
    height: 60
  }
});

// export default connect(mapStateToProps, mapDispatchToProps)(Main);
export default Main;
