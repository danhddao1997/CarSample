import {JobCheckpointStatus, JobInstanceStatus} from '../../utils/enums';

export interface Location {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Job {
  id: string;
  startTime: number;
  pickUp: Location;
  destination: Location;
  name: string;
  total: number;
}

export interface JobInstanceCheckpoint {
  id: string;
  time: number;
  status: JobCheckpointStatus;
  location: Location;
}

export interface JobInstance {
  id: string;
  jobId: string;
  checkpoints?: JobInstanceCheckpoint[];
  status?: JobInstanceStatus;
  time?: number;
}
