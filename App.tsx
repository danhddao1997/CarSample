import React from 'react';
import AppNavigator from './src/navigation';
import {StatusBar, StyleSheet} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {persistor, store} from './src/appRedux';
import {PersistGate} from 'redux-persist/integration/react';

Mapbox.setAccessToken(
  'pk.eyJ1IjoiZGRhbmhkZGFvIiwiYSI6ImNsa2FqdTlzYjA2c3kzZHE5eGE5bW9qM2QifQ.D6N6-nMfuhMNmES04YiqAQ',
);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView style={styles.main}>
          <StatusBar
            translucent
            backgroundColor={'transparent'}
            barStyle={'dark-content'}
          />
          <AppNavigator />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
