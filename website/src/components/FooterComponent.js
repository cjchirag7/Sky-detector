import React, { Component } from 'react';
class Footer extends Component {
  render() {
    return (
      <React.Fragment>
        <p
          className='footer'
          align='center'
          style={{ position: 'sticky', left: '0px', color: 'black' }}
        >
          © Copyright 2019 Team Believers IIT (ISM){' '}
        </p>
      </React.Fragment>
    );
  }
}

export default Footer;
