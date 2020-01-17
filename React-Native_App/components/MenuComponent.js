import React, { Component } from 'react';
import { FlatList, Text } from 'react-native';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { imageUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import { DISHES } from '../shared/dishes';
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

class Menu extends Component {
  static navigationOptions = {
    title: 'Menu'
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { navigate } = this.props.navigation;
    const renderMenuItem = ({ item, index }) => {
      return (
        <Animatable.View animation='fadeInRightBig' duration={2000}>
          <Tile
            key={index}
            title={item.name}
            caption={item.description}
            featured
            imageSrc={{ uri: imageUrl + item.image }}
            onPress={() => navigate('HistoryDetail', { dishId: item.id })}
          />
        </Animatable.View>
      );
    };

    // if (this.props.dishes.isLoading) {
    //   return <Loading />;
    // } else if (this.props.dishes.errMess) {
    //   return <Text>{this.props.dishes.errMess}</Text>;
    // } else
    return (
      <FlatList
        data={DISHES.dishes}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id.toString()}
      />
    );
  }
}

// export default connect(mapStateToProps)(Menu);
export default Menu;
