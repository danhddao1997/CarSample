import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {JobInstance, Location} from '../../ts/models';
import {JOBS_LIST} from '../../utils/constants';
import {convertAmountToCurrency} from '../../utils/functions/currency';
import dayjs from 'dayjs';
import {JobInstanceStatus} from '../../utils/enums';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AppNavigationParamsList from '../../ts/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

interface ItemLocationProps {
  location: Location;
  isDestination: boolean;
}

interface Props {
  job: JobInstance;
}

const JobItemLocation: FC<ItemLocationProps> = ({location, isDestination}) => {
  const left = useMemo(() => {
    return isDestination ? (
      <View style={styles.leftStart} />
    ) : (
      <MaterialIcon name="hail" size={24} color="#2979FF" />
    );
  }, [isDestination]);

  return (
    <View style={styles.bottomRow}>
      {left}
      <Text style={styles.right}>
        <Text style={styles.title}>{location.name}</Text>
        <Text style={styles.subtitle}>{` - ${location.address}`}</Text>
      </Text>
    </View>
  );
};

const JobItem: FC<Props> = ({job}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppNavigationParamsList, 'Main'>>();

  const jobInfo = useMemo(() => {
    return JOBS_LIST.find(j => j.id === job.jobId)!;
  }, [job.jobId]);

  const onDetail = useCallback(() => {
    navigate('JobDetail', {
      jobInstance: job,
      jobInfo,
    });
  }, [job, jobInfo, navigate]);

  return (
    <TouchableOpacity
      disabled={job.status !== JobInstanceStatus.ongoing}
      activeOpacity={0.8}
      style={styles.container}
      onPress={onDetail}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{jobInfo?.name}</Text>
        <Text style={styles.income}>
          {convertAmountToCurrency(jobInfo?.total || 0)}
        </Text>
      </View>
      <Text style={styles.duration}>
        {/* @ts-ignore */}
        {`In ${dayjs(jobInfo?.startTime).fromNow(true)}`}
      </Text>
      <JobItemLocation location={jobInfo?.pickUp!} isDestination={false} />
      <View style={styles.divider} />
      <JobItemLocation location={jobInfo?.destination!} isDestination />
    </TouchableOpacity>
  );
};

export default JobItem;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#16141e',
    borderRadius: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  income: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
  },
  duration: {
    textAlign: 'right',
    color: '#fff',
    opacity: 0.75,
    marginTop: 4,
    marginBottom: 16,
  },
  bottomRow: {
    flexDirection: 'row',
  },
  leftStart: {
    width: 18,
    height: 18,
    backgroundColor: '#2979FF',
    borderRadius: 9,
  },
  leftEnd: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2979FF',
  },
  divider: {
    margin: 8,
    height: 32,
    width: 2,
    backgroundColor: '#2979FF',
  },
  right: {
    flex: 1,
    marginLeft: 8,
    flexWrap: 'wrap',
  },
  subtitle: {
    color: '#fff',
    opacity: 0.75,
    fontSize: 16,
  },
});
