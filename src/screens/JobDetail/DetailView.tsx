import {
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import CompleteButton from './CompleteButton';
import FullScreenTop from './FullScreenTop';
import StandardRide from './StandardRide';
import {Job, JobInstance, JobInstanceCheckpoint} from '../../ts/models';
import dayjs from 'dayjs';
import {convertAmountToCurrency} from '../../utils/functions/currency';
import {CHECKPOINT_STATUS_MAP} from '../../utils/constants';
import {JobCheckpointStatus} from '../../utils/enums';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {CompleteButtonRefProps} from '../../ts/components';

const {height: sHeight} = Dimensions.get('screen');

interface Props {
  onChangeHeight: (value: number, isTop: boolean) => void;
  jobInstance: JobInstance;
  jobInfo: Job;
  showErrorDialog: () => void;
}

const DetailView: FC<Props> = ({
  onChangeHeight,
  jobInstance,
  jobInfo,
  showErrorDialog,
}) => {
  const [minBound, setMinBound] = useState(0);
  const [isTop, setIsTop] = useState(false);
  const [completing, setCompleting] = useState(false);

  const completeButtonRef = useRef<CompleteButtonRefProps>(null);

  const animatedTranslateY = useSharedValue(0);
  const previousTranslateY = useSharedValue({y: 0});

  const onEndDrag = useCallback(() => {
    'worklet';
    const currentAnimatedYValue = animatedTranslateY.value;
    const halfHeightYValue = -sHeight / 2;
    const halfHeightLowThreshold =
      halfHeightYValue - ((halfHeightYValue - minBound) * 2) / 3;
    const halfHeightHighThreshold = (-sHeight * 3) / 4;
    const destination =
      currentAnimatedYValue > halfHeightLowThreshold
        ? minBound
        : currentAnimatedYValue < halfHeightHighThreshold
        ? -sHeight
        : -sHeight / 2;
    animatedTranslateY.value = withTiming(destination, {
      duration: 300,
    });
    const iTop = destination === -sHeight;
    runOnJS(setIsTop)(iTop);
    runOnJS(onChangeHeight)(destination, iTop);
  }, [animatedTranslateY, minBound, onChangeHeight]);

  const gesture = useMemo(() => {
    return Gesture.Pan()
      .onStart(() => {
        previousTranslateY.value = {y: animatedTranslateY.value};
      })
      .onUpdate(({translationY}) => {
        animatedTranslateY.value = Math.min(
          Math.max(translationY + previousTranslateY.value.y, -sHeight),
          minBound,
        );
      })
      .onEnd(onEndDrag);
  }, [animatedTranslateY, minBound, onEndDrag, previousTranslateY]);

  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: animatedTranslateY.value}],
    };
  }, []);

  useEffect(() => {
    animatedTranslateY.value = minBound;
  }, [animatedTranslateY, minBound]);

  const onTopLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (minBound === 0) {
        const initialHeight = -e.nativeEvent.layout.height;
        setMinBound(initialHeight);
        onChangeHeight(initialHeight, false);
      }
    },
    [minBound, onChangeHeight],
  );

  const renderCheckpoint = useCallback(
    (checkpoint: JobInstanceCheckpoint, index: number) => {
      const {location, status, time, id} = checkpoint;
      const isFirst = index === 0;
      const isLast = index === jobInstance.checkpoints!.length - 1;
      const marginBottom = isLast ? 0 : 80;
      return (
        <View key={`checkpoint-${id}`} style={!isLast && styles.beforeLastItem}>
          {isLast ? null : <View style={styles.line} />}
          <View style={[styles.checkpointContainer, {marginBottom}]}>
            <View style={styles.checkpointLeftContainer}>
              {isFirst ? (
                <MaterialIcon name="hail" size={24} color="#2979FF" />
              ) : (
                <View style={styles.leftIcon} />
              )}
            </View>
            <View style={styles.checkpointRight}>
              {isFirst ? null : (
                <Text style={styles.checkpointTime}>
                  {dayjs(time!).format('HH:mm A')}
                </Text>
              )}
              <Text style={styles.checkpointTitle}>{location.name}</Text>
              <Text style={styles.checkpointSubtitle}>{location.address}</Text>
              <Text style={styles.checkpointStatus}>
                {CHECKPOINT_STATUS_MAP[status]}
              </Text>
            </View>
          </View>
        </View>
      );
    },
    [jobInstance.checkpoints],
  );

  useEffect(() => {
    if (completing) {
      setTimeout(() => {
        if (
          jobInstance.checkpoints![jobInstance.checkpoints!.length - 1]
            .status !== JobCheckpointStatus.arrivedBack
        ) {
          showErrorDialog?.();
        } else {
        }
        completeButtonRef.current?.cancelComplete();
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completing]);

  const displays = useMemo(() => {
    return {
      nonFullScreenTop: {display: isTop ? 'none' : 'flex'} as ViewStyle,
      fullScreenTop: {display: isTop ? 'flex' : 'none'} as ViewStyle,
    };
  }, [isTop]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, bottomSheetStyle]}>
        <View style={displays.nonFullScreenTop} onLayout={onTopLayout}>
          <View style={styles.top}>
            <Text style={styles.date}>
              {dayjs(jobInstance.time!).format('DD')}
            </Text>
            <View style={styles.topCenter}>
              <Text style={styles.title}>
                {dayjs(jobInstance.time!).format('MMMM')}
              </Text>
              <Text style={styles.subtitle}>{jobInstance!.id}</Text>
            </View>
            <Text style={styles.amount}>
              {convertAmountToCurrency(jobInfo.total)}
            </Text>
          </View>
          <StandardRide />
        </View>
        <View style={displays.fullScreenTop}>
          <FullScreenTop
            jobId={jobInfo.id}
            total={jobInfo.total}
            completing={completing}
          />
        </View>
        <View style={styles.tripCheckpointContainer}>
          {jobInstance.checkpoints?.map(renderCheckpoint)}
        </View>
        <View style={styles.jobDateRow}>
          <Text style={styles.jobDateTitle}>Job date</Text>
          <Text style={styles.jobDate}>
            {dayjs(jobInstance.time!).format('DD/MM/YYYY')}
          </Text>
        </View>
        <CompleteButton
          ref={completeButtonRef}
          completing={completing}
          setCompleting={setCompleting}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default DetailView;

const styles = StyleSheet.create({
  container: {
    height: sHeight,
    backgroundColor: '#fff',
    width: '100%',
    position: 'absolute',
    top: sHeight,
    borderRadius: 8,
  },
  top: {
    flexDirection: 'row',
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#16141e',
  },
  date: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  topCenter: {
    flex: 1,
    flexWrap: 'wrap',
    marginHorizontal: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  subtitle: {
    marginTop: 4,
    color: '#fff',
    opacity: 0.75,
  },
  amount: {
    fontSize: 24,
    fontWeight: '300',
    color: '#fff',
  },
  tripCheckpointContainer: {
    paddingLeft: 32,
    paddingRight: 24,
  },
  jobDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: 32,
  },
  jobDateTitle: {
    color: '#9E9E9E',
    fontSize: 16,
  },
  jobDate: {
    fontWeight: '600',
    fontSize: 16,
    color: '#000',
  },
  beforeLastItem: {
    marginBottom: 8,
  },
  checkpointTitle: {
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 24,
    color: '#000',
  },
  checkpointSubtitle: {
    color: '#9E9E9E',
    marginVertical: 4,
    fontSize: 16,
  },
  checkpointStatus: {
    color: '#43A047',
    fontSize: 16,
    fontWeight: '600',
  },
  checkpointRight: {
    flex: 1,
    marginLeft: 16,
  },
  line: {
    width: 2,
    height: '100%',
    backgroundColor: '#1778F2',
    position: 'absolute',
    zIndex: -1,
    left: 11,
  },
  checkpointLeftContainer: {
    backgroundColor: '#fff',
    paddingBottom: 8,
    alignSelf: 'flex-start',
  },
  leftIcon: {
    backgroundColor: '#1778F2',
    width: 24,
    aspectRatio: 1,
    borderRadius: 12,
  },
  checkpointContainer: {
    flexDirection: 'row',
  },
  checkpointTime: {
    color: '#1778F2',
    fontSize: 16,
    marginBottom: 8,
  },
});
