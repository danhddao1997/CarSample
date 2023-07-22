import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {FC, useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  paddingBottom: number;
  onClickCurrentLocation: () => void;
}

const CurrentUserLocation: FC<Props> = ({
  paddingBottom,
  onClickCurrentLocation,
}) => {
  const {right} = useSafeAreaInsets();

  const extraStyle = useMemo(() => {
    return {
      right: right + 12,
      bottom: paddingBottom + 12,
    };
  }, [paddingBottom, right]);

  return (
    <TouchableOpacity
      onPress={onClickCurrentLocation}
      style={[styles.main, extraStyle]}>
      <MaterialIcon name="my-location" size={20} color="#000" />
    </TouchableOpacity>
  );
};

export default CurrentUserLocation;

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
