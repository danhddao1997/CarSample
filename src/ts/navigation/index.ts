import {NavigatorScreenParams} from '@react-navigation/native';
import {Job, JobInstance} from '../models';

export type MainBottomTabParamsList = {
  Home: undefined;
  Coin: undefined;
  Job: undefined;
  Menu: undefined;
};

type AppNavigationParamsList = {
  Main: NavigatorScreenParams<MainBottomTabParamsList>;
  JobDetail: {
    jobInstance: JobInstance;
    jobInfo: Job;
  };
};

export default AppNavigationParamsList;
