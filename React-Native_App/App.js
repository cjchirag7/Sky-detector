import React from 'react';
// import { Provider } from 'react-redux';
import Main from './components/MainComponent';
// import { ConfigureStore } from './redux/configureStore';
// import { PersistGate } from 'redux-persist/integration/react';
// import { Loading } from './components/LoadingComponent';

// const { persistor, store } = ConfigureStore();

export default class App extends React.Component {
  render() {
    return (
      // <Provider store={store}>
      //   <PersistGate loading={<Loading />} persistor={persistor}>
      <Main style={{ fontFamily: 'Roboto' }} />
      //   </PersistGate>
      // </Provider>
    );
  }
}
