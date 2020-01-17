import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Dishes } from './dishes';
import { Comments } from './comments';
import { Promotions } from './promotions';
import { Leaders } from './leaders';
import { favorites } from './favorites';
// import { Auth } from './auth';
// import { InitialFeedback } from './forms';

import { persistStore, persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';

export const ConfigureStore = () => {
  const config = {
    key: 'root',
    debug: true,
    storage: AsyncStorage
  };

  const store = createStore(
    persistCombineReducers(config, {
      dishes: Dishes,
      comments: Comments,
      promotions: Promotions,
      leaders: Leaders,
      favorites
    }),
    applyMiddleware(thunk, logger)
  );
  const persistor = persistStore(store);

  return { persistor, store };
};
