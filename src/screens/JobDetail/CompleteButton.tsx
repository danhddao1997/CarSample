import {
  ActivityIndicator,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CompleteButtonRefProps} from '../../ts/components';

const CIRCLE_SIZE = 42;

interface Props {
  completing: boolean;
  setCompleting: (val: boolean) => void;
}

const CompleteButton = forwardRef<CompleteButtonRefProps, Props>(
  ({completing, setCompleting}, ref) => {
    const completeTextAnimatedValue = useSharedValue(0);
    const swipeCircleAnimatedValue = useSharedValue(0);
    const swipePreviousAnimatedValue = useSharedValue(0);
    const [rightBound, setRightBound] = useState(-1);
    const [enabled, setEnabled] = useState(true);

    const onStartCompleteFn = useCallback(() => {
      setCompleting(true);
    }, [setCompleting]);

    useImperativeHandle(
      ref,
      () => {
        return {
          cancelComplete: () => {
            setCompleting(false);

            swipeCircleAnimatedValue.value = withTiming(
              0,
              {
                duration: 300,
              },
              finished => {
                if (finished) {
                  runOnJS(setEnabled)(true);
                }
              },
            );
          },
        };
      },
      [swipeCircleAnimatedValue, setCompleting],
    );

    const swipeGesture = useMemo(() => {
      return Gesture.Pan()
        .enabled(enabled)
        .onStart(() => {
          swipePreviousAnimatedValue.value = swipeCircleAnimatedValue.value;
        })
        .onUpdate(({translationX}) => {
          swipeCircleAnimatedValue.value = Math.max(
            Math.min(
              translationX + swipePreviousAnimatedValue.value,
              rightBound - CIRCLE_SIZE - 8,
            ),
            0,
          );
        })
        .onEnd(() => {
          const shouldCallComplete =
            swipeCircleAnimatedValue.value >=
            (rightBound - CIRCLE_SIZE - 8) * 0.8;
          runOnJS(setEnabled)(false);
          swipeCircleAnimatedValue.value = withTiming(
            shouldCallComplete ? rightBound - CIRCLE_SIZE - 8 : 0,
            {
              duration: 200,
            },
            finished => {
              if (finished && !shouldCallComplete) {
                runOnJS(setEnabled)(true);
              }
            },
          );
          if (shouldCallComplete) {
            runOnJS(onStartCompleteFn)();
          }
        });
    }, [
      enabled,
      onStartCompleteFn,
      rightBound,
      swipeCircleAnimatedValue,
      swipePreviousAnimatedValue,
    ]);

    useEffect(() => {
      completeTextAnimatedValue.value = withRepeat(
        withTiming(1, {
          duration: 600,
        }),
        -1,
        true,
      );
    }, [completeTextAnimatedValue]);

    const onContainerLayout = useCallback(
      (e: LayoutChangeEvent) => {
        if (rightBound < 0) {
          setRightBound(e.nativeEvent.layout.width);
        }
      },
      [rightBound],
    );

    const completeTitleStyle = useAnimatedStyle(() => {
      return {
        color: interpolateColor(
          completeTextAnimatedValue.value,
          [0, 1],
          ['#000', '#fff'],
        ),
      };
    }, []);

    const swipeCircleStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: swipeCircleAnimatedValue.value}],
      };
    }, []);

    return (
      <View style={styles.container} onLayout={onContainerLayout}>
        <Animated.Text style={[styles.completeTitle, completeTitleStyle]}>
          Complete
        </Animated.Text>
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={[styles.swipeButton, swipeCircleStyle]}>
            {completing ? (
              <ActivityIndicator color={'#000'} size={'small'} />
            ) : (
              <MaterialCommunityIcon
                name="gesture-swipe-horizontal"
                color="#000"
                size={24}
              />
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    );
  },
);

export default CompleteButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1778F2',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginHorizontal: 24,
  },
  completeTitle: {
    fontWeight: '600',
    fontSize: 18,
  },
  swipeButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 4,
    height: CIRCLE_SIZE,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
