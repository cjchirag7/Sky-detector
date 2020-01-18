import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';
class Contact extends Component {
  static navigationOptions = {
    title: 'Contact Us'
  };
  sendMail() {
    MailComposer.composeAsync({
      recipients: ['cjchirag7@gmail.com'],
      subject: 'Feedback for the app',
      body: 'To the developers of this app :'
    });
  }
  render() {
    return (
      <View>
        <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
          <Card title='Developers'>
            <Text>
              {`
        This app was developed by : \n
        1.Chirag Jain\n
        2. Saharsh Singh\n
        3. Ayush Singh\n
        4. Prince Arya\n
        5. Sachin Shukla\n
        6. Kavya Kandhway\n`}
            </Text>
            <Button
              title=' Give feedback'
              buttonStyle={{ backgroundColor: '#512DA8' }}
              icon={
                <Icon name='envelope-o' type='font-awesome' color='white' />
              }
              onPress={this.sendMail}
            />
          </Card>
        </Animatable.View>
      </View>
    );
  }
}

export default Contact;
