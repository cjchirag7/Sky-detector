import React, { Component } from 'react';
// import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { FlatList, Text, ScrollView, StyleSheet, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { imageUrl, baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
// import { HISTORIES } from '../shared/histories';
import * as Animatable from 'react-native-animatable';
import {
  Card,
  CardContent,
  CardAction,
  CardButton,
  CardImage
} from 'react-native-material-cards';

// const mapStateToProps = state => {
//   return {
//     dishes: {
//       dishes: DISHES, //state.dishes
//       isLoading: false,
//       errMess: ''
//     }
//   };
// };

class History extends Component {
  static navigationOptions = {
    title: 'History'
  };

  constructor(props) {
    super(props);
    this.state = {
      histories: [],
      loaded: false
    };
  }

  componentDidMount() {
    this.fetchHistory();
  }

  fetchHistory() {
    SecureStore.getItemAsync('userStatus')
      .then(userstat => {
        let userStatus = JSON.parse(userstat);
        if (userStatus.loggedIn) {
          SecureStore.getItemAsync('userinfo')
            .then(userdata => {
              let userinfo = JSON.parse(userdata);
              console.log(userinfo);
              let username = userinfo.username;
              // Upwload the image using the fetch and FormData APIs
              let formData = new FormData();
              // Assume "photo" is the name of the form field the server expects
              formData.append('username', username);
              return fetch(`${baseUrl}get_histories`, {
                method: 'POST',
                body: formData,
                header: {
                  'content-type': 'multipart/form-data'
                },
                credentials: 'same-origin'
              })
                .then(
                  response => {
                    this.setState({ loaded: true });
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
                  const { histories, success, msg, error } = response;
                  if (success && !msg) this.setState({ histories: histories });
                  else if (!success) console.log(error);
                })
                .catch(error => {
                  console.log(error.message);
                  // Alert.alert(error.message);
                });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log('User not logged in');
          return;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    const { histories, loaded } = this.state;
    if (!loaded) return <Loading />;
    if (!histories.length) {
      return <Text> {'\t'}No history available. </Text>;
    }
    const renderHistoryItem = ({ item, index }) => {
      return (
        <Animatable.View animation='fadeInRightBig' duration={2000}>
          <Card>
            <CardImage source={{ uri: imageUrl + item.image }} />
            <CardContent>
              <Text style={styles.title}>
                {item.created_at.split('GMT')[0]}
              </Text>
              <Text style={styles.headline}>{item.addr1}</Text>
              <Text style={styles.headline}>{item.addr2}</Text>
            </CardContent>
            <CardAction
              separator={true}
              inColumn={false}
              style={{ justifyContent: 'center', margin: 'auto' }}
            >
              <CardButton
                onPress={() =>
                  navigate('HistoryDetail', {
                    mask: item.mask,
                    angles: item.angles,
                    percent: item.percent,
                    image: item.image
                  })
                }
                title='View mask'
                color='blue'
              />
            </CardAction>
          </Card>
          {/* <Card
            style={styles.container}
            onPress={() =>
              navigate('HistoryDetail', {
                mask: item.mask,
                angles: item.angles,
                percent: item.percent,
                image: item.image
              })
            }
          >
            <Card.Title
              title={item.created_at}
              left={props => <Avatar.Icon {...props} icon='image' />}
            />
            {/* <Card.Content></Card.Content> */}
          {/* <Card.Cover source={{ uri: imageUrl + item.image }} />
          </Card>  */}
        </Animatable.View>
      );
    };

    // if (this.props.histories.isLoading) {
    //   return <Loading />;
    // } else if (this.props.histories.errMess) {
    //   return <Text>{this.props.histories.errMess}</Text>;
    // } else
    return (
      <ScrollView>
        <FlatList
          data={histories}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id.toString()}
        />
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    margin: 'auto'
  },
  headline: {
    textAlign: 'center',
    fontSize: 18,
    margin: 'auto'
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    margin: 'auto',
    fontWeight: 'bold'
  }
});

// export default connect(mapStateToProps)(History);
export default History;
