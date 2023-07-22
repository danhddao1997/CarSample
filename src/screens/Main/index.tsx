import {StyleSheet, Text, View} from 'react-native';
import React, {memo, useCallback} from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {MainBottomTabParamsList} from '../../ts/navigation';
import JobsScreen from '../Jobs';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RouteProp} from '@react-navigation/native';
import {HOME_ICON_MAPPING} from '../../utils/constants';
import {useAppSelector} from '../../hooks/redux';
import {JobInstanceStatus} from '../../utils/enums';

interface JobIconProps {
  color: string;
}

const MainBottomTab = createBottomTabNavigator<MainBottomTabParamsList>();

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.text}>Home Screen</Text>
    </SafeAreaView>
  );
};

const CoinScreen = () => {
  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.text}>Coin Screen</Text>
    </SafeAreaView>
  );
};

const MenuScreen = () => {
  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.text}>Menu Screen</Text>
    </SafeAreaView>
  );
};

const JobIcon = memo(({color}: JobIconProps) => {
  const jobs = useAppSelector(state => state.jobs.jobs);
  const showNotification =
    jobs.findIndex(j => j.status === JobInstanceStatus.ongoing) > -1;

  return (
    <View>
      <MaterialCommunityIcon name={'car'} size={24} color={color} />
      {showNotification ? <View style={styles.notification} /> : null}
    </View>
  );
});

const MainScreen = () => {
  const renderTabBarIcon = useCallback(
    (color: string, routeName: keyof MainBottomTabParamsList) => {
      return routeName === 'Job' ? (
        <JobIcon color={color} />
      ) : (
        <MaterialCommunityIcon
          name={HOME_ICON_MAPPING[routeName]}
          size={24}
          color={color}
        />
      );
    },
    [],
  );

  const tabScreenOptions = useCallback(
    ({
      route,
    }: {
      route: RouteProp<MainBottomTabParamsList, keyof MainBottomTabParamsList>;
    }): BottomTabNavigationOptions => {
      return {
        tabBarActiveTintColor: '#2979FF',
        tabBarInactiveTintColor: '#BDBDBD',
        headerShown: false,
        tabBarIcon: ({color}) => renderTabBarIcon(color, route.name),
        tabBarLabelStyle: {
          fontSize: 16,
        },
      };
    },
    [renderTabBarIcon],
  );

  return (
    <View style={styles.main}>
      <MainBottomTab.Navigator screenOptions={tabScreenOptions}>
        <MainBottomTab.Screen name="Home" component={HomeScreen} />
        <MainBottomTab.Screen name="Coin" component={CoinScreen} />
        <MainBottomTab.Screen name="Job" component={JobsScreen} />
        <MainBottomTab.Screen name="Menu" component={MenuScreen} />
      </MainBottomTab.Navigator>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabLabel: {
    fontSize: 16,
  },
  notification: {
    width: 12,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  text: {
    color: '#000',
  },
});
