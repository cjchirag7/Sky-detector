import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Modal,
  StyleSheet,
  Button,
  Alert,
  PanResponder,
  Share
} from 'react-native';

import { Card, Icon, Rating, Input } from 'react-native-elements';
//import console = require('../console');
// import { connect } from 'react-redux';
// import { baseUrl, imageUrl } from '../shared/baseUrl';
// import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';
import { HISTORIES } from '../shared/histories.js';

// const mapStateToProps = state => {
//   return {
//     dishes: state.dishes,
//     comments: state.comments,
//     favorites: state.favorites
//   };
// };

// const mapDispatchToProps = dispatch => ({
//   postFavorite: dishId => dispatch(postFavorite(dishId))
// });

function RenderDish(props) {
  handleViewRef = ref => (this.view = ref);
  // const dish = props.dish;
  const dish = HISTORIESS[0];
  const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
    if (dx < -200) return true;
    else return false;
  };

  const recognizeComment = ({ moveX, moveY, dx, dy }) => {
    if (dx > 200) return true;
    else return false;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => {
      return true;
    },
    onPanResponderGrant: () => {
      this.view
        .rubberBand(1000)
        .then(endState =>
          console.log(endState.finished ? 'finished' : 'cancelled')
        );
    },
    onPanResponderEnd: (e, gestureState) => {
      console.log('pan responder end', gestureState);
      if (recognizeDrag(gestureState)) {
        Alert.alert(
          'Add Favorite',
          'Are you sure you wish to add ' + dish.name + ' to favorite?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
            {
              text: 'OK',
              onPress: () => {
                // props.favorite
                //   ? console.log('Already favorite')
                //   : props.onPress();
                console.log('Made favorite');
              }
            }
          ],
          { cancelable: false }
        );
      } else if (recognizeComment(gestureState)) {
        // props.onSelect();
        console.log(' selected');
      }
      return true;
    }
  });

  const shareDish = (title, message, url) => {
    Share.share(
      {
        title: title,
        message: title + ': ' + message + ' ' + url,
        url: url
      },
      {
        dialogTitle: 'Share ' + title
      }
    );
  };

  if (dish != null) {
    return (
      <Animatable.View
        animation='fadeInDown'
        duration={2000}
        delay={1000}
        ref={this.handleViewRef}
        {...panResponder.panHandlers}
      >
        <Card featuredTitle={dish.name} image={{ uri: imageUrl + dish.image }}>
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            <Icon
              raised
              reverse
              type='font-awesome'
              name={props.favorite ? 'heart' : 'heart-o'}
              color='#f50'
              onPress={() =>
                props.favorite
                  ? console.log('Already favorite')
                  : // : props.onPress()
                    console.log('not fav')
              }
            ></Icon>
            <Icon
              raised
              reverse
              type='font-awesome'
              name={'pencil'}
              color='#800080'
              // onPress={() => props.onSelect()}
            ></Icon>
            <Icon
              raised
              reverse
              name='share'
              type='font-awesome'
              color='#51D2A8'
              style={styles.cardItem}
              onPress={() =>
                shareDish(dish.name, dish.description, imageUrl + dish.image)
              }
            />
          </View>
        </Card>
      </Animatable.View>
    );
  } else {
    return <View />;
  }
}

function RenderComments(props) {
  const comments = [];
  const RenderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}> {item.comment}</Text>
        <Text style={{ fontSize: 12 }}> {item.rating} Stars</Text>
        <Text style={{ fontSize: 12 }}>
          {' '}
          {'---' + item.author + ', ' + item.date}
        </Text>
      </View>
    );
  };

  return (
    <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
      <Card title='Comments'>
        <FlatList
          data={comments}
          renderItem={RenderCommentItem}
          keyExtractor={item => item.id.toString()}
        />
      </Card>
    </Animatable.View>
  );
}

class HistoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 5,
      showModal: false,
      author: '',
      comment: ''
    };
    this.ratingCompleted = this.ratingCompleted.bind(this);
  }
  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  markFavorite(dishId) {
    // this.props.postFavorite(dishId);
    console.log(dishId);
  }

  static navigationOptions = {
    title: 'Dish Details'
  };

  handleComments(dishId) {
    console.log(JSON.stringify(this.state));
    this.toggleModal();
    // postComment(
    //   dishId,
    //   this.state.rating,
    //   this.state.comment,
    //   this.state.author
    // );
  }

  ratingCompleted(val) {
    this.setState({
      rating: val
    });
  }

  render() {
    const dishId = this.props.navigation.getParam('dishId', '');
    return (
      <ScrollView>
        <RenderDish
          dish={HISTORIES[+dishId]}
          // favorite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          onSelect={() => this.toggleModal()}
        />
        <RenderComments
          // comments={this.props.comments.comments.filter(
          //   comment => comment.dishId === dishId
          // )}
          comments={[]}
        />
        <Modal
          animation={'slide'}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => this.toggleModal()}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <View>
              <Rating
                showRating
                type='star'
                fractions={0}
                startingValue={0}
                imageSize={40}
                onFinishRating={rating => this.setState({ rating: rating })}
              />
            </View>
            <View>
              <Input
                placeholder='  Author'
                leftIcon={
                  <Icon
                    name='user-o'
                    type='font-awesome'
                    size={24}
                    style={{ margin: 20 }}
                  />
                }
                onChangeText={value => this.setState({ author: value })}
              />
            </View>
            <View>
              <Input
                placeholder='  Comment'
                leftIcon={
                  <Icon
                    name='comment-o'
                    type='font-awesome'
                    size={24}
                    style={{ margin: 4 }}
                  />
                }
                onChangeText={value => this.setState({ comment: value })}
              />
            </View>
            <View>
              <Text>{'\n'}</Text>
            </View>
            <View>
              <Button
                raised={true}
                buttonStyle={styles.button1}
                title='SUBMIT'
                onPress={() => this.handleComments(dishId)}
              />
            </View>
            <View>
              <Text>{'\n'}</Text>
            </View>
            <View>
              <Button
                raised={true}
                onPress={() => this.toggleModal()}
                buttonStyle={styles.button2}
                title='CANCEL'
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 28
  },
  formLabel: {
    fontSize: 18,
    flex: 2
  },
  formItem: {
    flex: 1
  },
  modal: {
    justifyContent: 'center',
    margin: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#512DA8',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20
  },
  modalText: {
    fontSize: 18,
    margin: 10
  },
  button1: {
    backgroundColor: '#512DA8'
  },
  button2: {
    backgroundColor: '#808080'
  }
});

// export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
export default HistoryDetail;
