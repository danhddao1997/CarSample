import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';

const StandardRide = () => {
  return (
    <View style={styles.standardRideRow}>
      <View style={styles.standardRideIcon}>
        <Ionicon size={24} name="shield-checkmark" color="#fff" />
      </View>
      <Text style={styles.standardRide}>Standard Ride</Text>
    </View>
  );
};

export default StandardRide;

const styles = StyleSheet.create({
  standardRideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  standardRideIcon: {
    width: 48,
    aspectRatio: 1,
    backgroundColor: '#1778F2',
    marginRight: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  standardRide: {
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: '600',
    color: '#1778F2',
  },
});
