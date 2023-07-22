import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import JobDetailScreen from '../screens/JobDetail';
import AppNavigationParamsList from '../ts/navigation';
import MainScreen from '../screens/Main';

const Stack = createNativeStackNavigator<AppNavigationParamsList>();

const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            options={{
              headerShown: false,
            }}
            component={MainScreen}
          />
          <Stack.Screen
            name="JobDetail"
            options={{
              headerShown: false,
            }}
            component={JobDetailScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
