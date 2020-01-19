import React, { Component } from 'react';
import Header from './HeaderComponent.js';
import UploadItem from './UploadItemComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

let username = '';
class Main extends Component {
  componentDidMount() {}

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='App'>
        <Header />
        <UploadItem isAdmin={true} />
      </div>
    );
  }
}

export default Main;
