import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {forwardRef, useCallback, useImperativeHandle} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {assets} from '../../assets';

const {height: sHeight} = Dimensions.get('screen');

export interface ErrorDialogRefProps {
  openDialog: () => void;
}

interface Props {
  onCloseDialog?: () => void;
  destinationName: string;
}

const ErrorDialog = forwardRef<ErrorDialogRefProps, Props>(
  ({onCloseDialog, destinationName}, ref) => {
    const animatedYValue = useSharedValue(sHeight);
    const {bottom} = useSafeAreaInsets();

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateY: animatedYValue.value}],
      };
    }, []);

    useImperativeHandle(
      ref,
      () => {
        return {
          openDialog: () => {
            animatedYValue.value = withTiming(0, {duration: 300});
          },
        };
      },
      [animatedYValue],
    );

    const onCloseModal = useCallback(() => {
      animatedYValue.value = withTiming(sHeight, {
        duration: 300,
      });
      onCloseDialog?.();
    }, [animatedYValue, onCloseDialog]);

    return (
      <Animated.View style={[styles.main, animatedStyle]}>
        <View style={[styles.contentContainer, {paddingBottom: bottom + 16}]}>
          <TouchableOpacity
            style={styles.closeButton}
            activeOpacity={0.8}
            onPress={onCloseModal}>
            <MaterialIcon name="close" size={24} color={'#000'} />
          </TouchableOpacity>
          <Image
            source={assets.map_warning}
            style={styles.image}
            resizeMode="contain"
          />
          <Text
            style={styles.warningTitle}
            numberOfLines={2}
            ellipsizeMode="clip">
            You have not arrived back at {destinationName}
          </Text>
          <Text style={styles.warningSubtitle}>
            Please report back at Foyer 1 to complete the job.
          </Text>
          <TouchableOpacity
            style={styles.okButton}
            activeOpacity={0.8}
            onPress={onCloseModal}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  },
);

export default ErrorDialog;

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 2,
    position: 'absolute',
    height: sHeight,
    justifyContent: 'flex-end',
    width: '100%',
  },
  contentContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
  closeButton: {
    width: 24,
    alignSelf: 'flex-end',
    aspectRatio: 1,
  },
  image: {
    margin: 24,
    marginVertical: 24,
    alignSelf: 'center',
  },
  warningTitle: {
    color: '#000',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  warningSubtitle: {
    color: '#9E9E9E',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  okButton: {
    minHeight: 50,
    padding: 12,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  okButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
