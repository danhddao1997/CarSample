import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {JobsState} from '../../ts/redux/states';
import {JobInstanceStatus} from '../../utils/enums';
import {JOB_INSTANCES_LIST} from '../../utils/constants';

const initialState: JobsState = {
  jobs: JOB_INSTANCES_LIST,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setComplete: (state, action: PayloadAction<string>) => {
      const currentJobInstanceIndex = state.jobs.findIndex(
        item => item.id === action.payload,
      );
      state.jobs[currentJobInstanceIndex] = {
        ...state.jobs[currentJobInstanceIndex],
        status: JobInstanceStatus.completed,
      };
    },
  },
});

const jobsReducer = jobsSlice.reducer;

export const {setComplete} = jobsSlice.actions;

export default jobsReducer;
