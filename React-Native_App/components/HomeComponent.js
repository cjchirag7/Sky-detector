import React, { Component } from 'react';
import { Avatar, Card } from 'react-native-paper';
import { Text, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';

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
      <ScrollView>
        {/* <Animatable.View animation='fadeInRightBig' duration={2000}> */}
        <Card>
          <Card.Title
            title='Sky Detector'
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 18,
              margin: 'auto'
            }}
          />
          <Card.Content>
            <Text>
              Generating local sky horizon has important applications for
              analysis of solar energy potential in an urban setting. Develop a
              mobile application for automatically detecting sky pixels in a
              photograph. The application should generate a mask image
              consisting of sky pixels marked in white colour in the image and
              other pixels marked in black colour. Further, using information
              about camera optics, the application should give angle of
              elevation of the lowest sky pixel for all pixel columns in the
              mask image.
            </Text>
          </Card.Content>

          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        </Card>
        {/* </Animatable.View> */}
      </ScrollView>
    );
  }
}

// export default connect(mapStateToProps)(Home);
export default Home;
