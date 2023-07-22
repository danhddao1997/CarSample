import {Job, JobInstance} from '../../ts/models';
import {MainBottomTabParamsList} from '../../ts/navigation';
import {JobCheckpointStatus, JobInstanceStatus} from '../enums';

export const JOBS_LIST: Job[] = [
  {
    id: 'LY-4b3dec',
    startTime: 1670778000000,
    name: 'Expo Hall 7',
    total: 65,
    pickUp: {
      name: 'Expo Hall 7',
      address: 'Expo Hall 7, Singapore',
      longitude: 1.337063,
      latitude: 103.961562,
    },
    destination: {
      name: 'Far East Plaza',
      address: '14 Scotts Road, Orchard, Singapore, Singapore, 228213',
      longitude: 1.306938,
      latitude: 103.833562,
    },
  },
  {
    id: 'LY-4b3dce',
    startTime: 1670778000000,
    name: 'Expo Hall 7',
    total: 0,
    pickUp: {
      name: 'Vibe Hotel Singapore Orchard',
      address: '24 Mount Elizabeth, Singapore 228518',
      longitude: 1.308187,
      latitude: 103.835688,
    },
    destination: {
      name: 'Tanglin Mall',
      address: '163 Tanglin Rd, Singapore 247933',
      longitude: 1.304813,
      latitude: 103.823813,
    },
  },
];

export const JOB_INSTANCES_LIST: JobInstance[] = [
  {
    id: 'N95899',
    jobId: 'LY-4b3dec',
    checkpoints: [
      {
        id: 'N95899-0',
        time: 1689923611887,
        location: {
          name: 'Expo Hall 7',
          address: 'Expo Hall 7, Singapore',
          longitude: 1.337063,
          latitude: 103.961562,
        },
        status: JobCheckpointStatus.pickedUp,
      },
      {
        id: 'N95899-1',
        time: 1689923711887,
        location: {
          name: 'Far East Plaza',
          address: '14 Scotts Road, Orchard, Singapore, Singapore, 228213',
          longitude: 1.306938,
          latitude: 103.833562,
        },
        status: JobCheckpointStatus.droppedOff,
      },
    ],
    time: 1689923392241,
    status: JobInstanceStatus.ongoing,
  },
  {
    id: 'N95900',
    jobId: 'LY-4b3dce',
    status: JobInstanceStatus.available,
  },
];

export const HOME_STATUS_LABEL_MAP: Partial<{
  [key in JobInstanceStatus]: string;
}> = {
  [JobInstanceStatus.available]: 'Available',
  [JobInstanceStatus.ongoing]: 'Ongoing',
};

export const CHECKPOINT_STATUS_MAP: Partial<{
  [key in JobCheckpointStatus]: string;
}> = {
  [JobCheckpointStatus.pickedUp]: 'Picked up',
  [JobCheckpointStatus.droppedOff]: 'Dropped off',
  [JobCheckpointStatus.arrivedBack]: 'Arrived back',
};

export const HOME_ICON_MAPPING: Record<keyof MainBottomTabParamsList, string> =
  {
    Home: 'home-outline',
    Coin: 'currency-usd',
    Job: 'car',
    Menu: 'menu',
  };

export const MAPBOX_PUBLIC_APK = '';
