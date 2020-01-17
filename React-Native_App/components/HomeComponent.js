import React, { Component } from 'react';
import { Text, View, Animated, Easing } from 'react-native';
import { Card } from 'react-native-elements';
// import { connect } from 'react-redux';
// import { imageUrl } from '../shared/baseUrl';
// import { Loading } from './LoadingComponent';

// const mapStateToProps = state => {
//   return {
//     dishes: state.dishes,
//     comments: state.comments,
//     promotions: state.promotions,
//     leaders: state.leaders
//   };
// };

class Home extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Home'
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
        <Text>This is our home page</Text>
      </View>
    );
  }
}

// export default connect(mapStateToProps)(Home);
export default Home;
