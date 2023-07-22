import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const MapBackButton = () => {
  const {top, left} = useSafeAreaInsets();
  const {goBack} = useNavigation();

  const onGoBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const absoluteStyle = useMemo(() => {
    return {
      top: top + 12,
      left: left + 12,
    };
  }, [top, left]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onGoBack}
      style={[styles.main, absoluteStyle]}>
      <MaterialIcon size={20} name="arrow-back-ios-new" color="#000" />
    </TouchableOpacity>
  );
};

export default MapBackButton;

const styles = StyleSheet.create({
  main: {
    position: 'absolute',
    width: 44,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
