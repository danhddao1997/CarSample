import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';

const AccessNotAllowed = () => {
  const {goBack} = useNavigation();

  const onGoBack = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <View style={styles.container}>
      <Text style={styles.warningText}>Location access is not allowed</Text>
      <TouchableOpacity onPress={onGoBack} style={styles.goBackButton}>
        <Text style={styles.goBackText}>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccessNotAllowed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackButton: {
    alignSelf: 'center',
    marginTop: 12,
  },
  goBackText: {
    fontWeight: '500',
    color: '#000',
  },
  warningText: {
    color: '#000',
  },
});
