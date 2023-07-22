import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {HOME_STATUS_LABEL_MAP} from '../../utils/constants';
import {JobInstanceStatus} from '../../utils/enums';

const ROW_ITEMS = [
  ...Object.keys(HOME_STATUS_LABEL_MAP).map(k => Number(k)),
  -1,
];

interface Props {
  onUpdateSelectedIndex: (value: number) => void;
}

const StatusSelectRow: FC<Props> = ({onUpdateSelectedIndex}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(
    JobInstanceStatus.ongoing,
  );

  useEffect(() => {
    onUpdateSelectedIndex?.(selectedIndex);
  }, [selectedIndex, onUpdateSelectedIndex]);

  const renderItem = useCallback(
    ({item}: {item: (typeof ROW_ITEMS)[number]}) => {
      const onPress = () => {
        setSelectedIndex(prev =>
          prev === (item as JobInstanceStatus)
            ? prev
            : (item as JobInstanceStatus),
        );
      };

      const isSelected = selectedIndex === (item as JobInstanceStatus);

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={[
            styles.button,
            isSelected ? styles.selectedBtn : styles.unselectedBtn,
          ]}>
          <Text
            style={
              isSelected ? styles.selectedBtnTitle : styles.unselectedBtnTitle
            }>
            {HOME_STATUS_LABEL_MAP[item as JobInstanceStatus] || 'History'}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedIndex],
  );

  const ItemSeparator = useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  return (
    <FlatList
      style={styles.container}
      horizontal
      data={ROW_ITEMS}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
};

export default StatusSelectRow;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flexGrow: 0,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  unselectedBtn: {
    backgroundColor: '#E0E0E0',
  },
  selectedBtn: {
    backgroundColor: '#16141e',
  },
  unselectedBtnTitle: {
    color: '#616161',
  },
  selectedBtnTitle: {
    color: '#fff',
    fontWeight: '500',
  },
  separator: {
    width: 8,
  },
});
