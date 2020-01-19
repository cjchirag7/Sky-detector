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
              Sky finder is an app that will detect the sky and ground region in
              the image provided by the user by segmenting the sky and the
              ground region. The app will detect the sky region with the help of
              a Deep CNN based architecture build of the segmentation of the sky
              pixel in the image.
              {'\n'}
            </Text>
          </Card.Content>

          <Card.Cover
            source={{
              uri:
                'https://github-projects.s3.ap-south-1.amazonaws.com/samp2.jpeg'
            }}
          />
          <Card.Content>
            <Text>
              {'\n'}
              The app as its application the finding the solar energy potential
              in urban and rural setting. The app also provides the angle of
              elevation of lowest sky pixel in each column. The app will also
              store the user’s history so that the person can evaluate the
              solar potential of different regions of which he/she has taken the
              photo.
            </Text>
          </Card.Content>
        </Card>
        {/* </Animatable.View> */}
      </ScrollView>
    );
  }
}

// export default connect(mapStateToProps)(Home);
export default Home;
