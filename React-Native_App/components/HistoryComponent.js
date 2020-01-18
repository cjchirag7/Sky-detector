import React, { Component } from 'react';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { FlatList, Text, ScrollView, StyleSheet } from 'react-native';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { imageUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import { HISTORIES } from '../shared/histories';
import * as Animatable from 'react-native-animatable';

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
  }

  render() {
    const { navigate } = this.props.navigation;
    const renderHistoryItem = ({ item, index }) => {
      return (
        <Animatable.View animation='fadeInRightBig' duration={2000}>
          <Card
            style={styles.container}
            onPress={() =>
              navigate(
                'HistoryDetailComponent',
                { mask: imageUri },
                { angles: item.angles }
              )
            }
          >
            <Card.Title
              title={item.created_at}
              left={props => <Avatar.Icon {...props} icon='image' />}
            />
            <Card.Content></Card.Content>
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />}
          </Card>
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
          data={HISTORIES}
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
  }
});

// export default connect(mapStateToProps)(History);
export default History;
