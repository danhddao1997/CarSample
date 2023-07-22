import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback} from 'react';
import {Header, HeaderBackButton} from '@react-navigation/elements';
import {useNavigation} from '@react-navigation/native';
import StandardRide from './StandardRide';
import {convertAmountToCurrency} from '../../utils/functions/currency';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface Props {
  jobId: string;
  total: number;
  completing: boolean;
}

const FullScreenTop: FC<Props> = ({jobId, total, completing}) => {
  const {goBack} = useNavigation();

  const headerLeft = useCallback(() => {
    return <HeaderBackButton onPress={() => goBack()} tintColor="#000" />;
  }, [goBack]);

  const headerRight = useCallback(() => {
    return completing ? (
      <ActivityIndicator color={'tomato'} size={'small'} />
    ) : null;
  }, [completing]);

  return (
    <View>
      <Header
        title={jobId}
        headerLeft={headerLeft}
        headerRight={headerRight}
        headerLeftContainerStyle={styles.headerLeft}
        headerRightContainerStyle={styles.headerRight}
      />
      <View style={styles.headerBottomRow}>
        <Text style={styles.amount}>{convertAmountToCurrency(total)}</Text>
        <View style={styles.space} />
        <TouchableOpacity>
          <FeatherIcon size={24} color="#1778F2" name="refresh-cw" />
        </TouchableOpacity>
      </View>
      <StandardRide />
    </View>
  );
};

export default FullScreenTop;

const styles = StyleSheet.create({
  headerBottomRow: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#000',
  },
  space: {
    width: 8,
  },
  amount: {
    fontSize: 24,
    color: '#000',
  },
  headerLeft: {
    paddingLeft: 8,
  },
  headerRight: {
    paddingRight: 8,
  },
});
