import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import StatusSelectRow from './StatusSelectRow';
import JobItem from './JobItem';
import {useAppSelector} from '../../hooks/redux';
import {JobInstanceStatus} from '../../utils/enums';
import {JobInstance} from '../../ts/models';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';

const JobsScreen = () => {
  const [selectedJobType, setSelectedJobType] = useState<number>();

  const jobs = useAppSelector(state => state.jobs.jobs);

  const listData = useMemo(() => {
    if (typeof selectedJobType === 'undefined') {
      return [];
    } else if (selectedJobType === JobInstanceStatus.ongoing) {
      return jobs.filter(j => j.status === JobInstanceStatus.ongoing);
    } else if (selectedJobType === JobInstanceStatus.available) {
      return jobs.filter(j => j.status === JobInstanceStatus.available);
    } else {
      return jobs.filter(j => j.status === JobInstanceStatus.completed);
    }
  }, [jobs, selectedJobType]);

  const renderItem = useCallback(({item}: {item: JobInstance}) => {
    return <JobItem job={item} />;
  }, []);

  const keyExtractor = useCallback((item: JobInstance) => item.id, []);

  const ListSeparatorComponent = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  return (
    <View style={styles.main}>
      <LinearGradient
        style={styles.background}
        colors={['#fff', '#757575']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        locations={[0.8, 1]}
      />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Jobs</Text>
        <StatusSelectRow onUpdateSelectedIndex={setSelectedJobType} />
        <FlatList
          data={listData}
          contentContainerStyle={styles.flatListContentContainer}
          ListEmptyComponent={<Text>No items found</Text>}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={ListSeparatorComponent}
        />
        <TouchableOpacity activeOpacity={0.8} style={styles.button}>
          <MaterialCommunityIcon
            name="lightning-bolt"
            color="tomato"
            size={24}
          />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default JobsScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#16141e',
  },
  flatListContentContainer: {
    paddingTop: 8,
  },
  separator: {
    height: 12,
  },
  background: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: -1,
  },
  button: {
    width: 44,
    aspectRatio: 1,
    borderRadius: 22,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 16,
    left: 16,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
