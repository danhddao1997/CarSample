import {Platform, StyleSheet, View} from 'react-native';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Mapbox from '@rnmapbox/maps';
import {CameraRef} from '@rnmapbox/maps/lib/typescript/components/Camera';
import DetailView from './DetailView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MapBackButton from './MapBackButton';
import CurrentUserLocation from './CurrentUserLocation';
import AccessNotAllowed from './AccessNotAllowed';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {useRoute} from '@react-navigation/native';
import {getRoute} from '../../api/routes';
import {Job, JobInstance} from '../../ts/models';
import ErrorDialog, {ErrorDialogRefProps} from './ErrorDialog';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const lineLayerStyle = {
  lineColor: 'red',
  lineCap: 'round',
  lineJoin: 'round',
  lineWidth: 2,
};

interface MarkerProps {
  location: {
    latitude: number;
    longitude: number;
  };
  type: 'pickUp' | 'destination';
}

const CMarker: FC<MarkerProps> = ({location, type}) => {
  const iconName = type === 'pickUp' ? 'directions-car' : 'arrow-downward';

  return (
    <Mapbox.MarkerView coordinate={[location.latitude, location.longitude]}>
      <View style={styles.marker}>
        <MaterialIcon name={iconName} color="#fff" size={16} />
      </View>
    </Mapbox.MarkerView>
  );
};

const JobDetailScreen = () => {
  const cameraRef = useRef<CameraRef>(null);

  // for test app, set temporary lat long
  const [userCoordinate] = useState([103.833562, 1.306938]);
  const [routeCoordinates, setRouteCoordinates] = useState<number[][]>([]);
  const [marginBottom, setMarginBottom] = useState(0);
  const [allowedLocation, setAllowedLocation] = useState<boolean>(false);
  const [finishLoadingMap, setFinishLoadingMap] = useState(false);
  const {bottom} = useSafeAreaInsets();
  const {params} = useRoute();

  const errorDialogRef = useRef<ErrorDialogRefProps>(null);

  const {jobInstance, jobInfo} = params as {
    jobInstance: JobInstance;
    jobInfo: Job;
  };

  useEffect(() => {
    const nE = [
      Math.max(jobInfo.pickUp.latitude, jobInfo.destination.latitude),
      Math.max(jobInfo.pickUp.longitude, jobInfo.destination.longitude),
    ];

    const sW = [
      Math.min(jobInfo.pickUp.latitude, jobInfo.destination.latitude),
      Math.min(jobInfo.pickUp.longitude, jobInfo.destination.longitude),
    ];

    if (finishLoadingMap) {
      cameraRef.current?.fitBounds(nE, sW, [0, 40, marginBottom, 40]);
    }
  }, [
    jobInfo.destination.latitude,
    jobInfo.destination.longitude,
    jobInfo.pickUp.latitude,
    jobInfo.pickUp.longitude,
    finishLoadingMap,
    marginBottom,
  ]);

  useEffect(() => {
    const {pickUp, destination} = jobInfo;
    const {latitude: pickUpLat, longitude: pickUpLong} = pickUp;
    const {latitude: destinationLat, longitude: destinationLong} = destination;
    getRoute([pickUpLat, pickUpLong], [destinationLat, destinationLong]).then(
      rs => {
        setRouteCoordinates(rs);
      },
    );
  }, [jobInfo]);

  const onMoveMapUserLocation = useCallback(() => {
    const nE = [
      Math.max(jobInfo.pickUp.latitude, userCoordinate[0]),
      Math.max(jobInfo.pickUp.longitude, userCoordinate[1]),
    ];

    const sW = [
      Math.min(jobInfo.pickUp.latitude, userCoordinate[0]),
      Math.min(jobInfo.pickUp.longitude, userCoordinate[1]),
    ];

    if (finishLoadingMap) {
      cameraRef.current?.fitBounds(nE, sW, [0, 40, marginBottom, 40]);
    }
  }, [
    finishLoadingMap,
    jobInfo.pickUp.latitude,
    jobInfo.pickUp.longitude,
    userCoordinate,
    marginBottom,
  ]);

  useEffect(() => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_ALWAYS
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    check(permission).then(rs => {
      if (rs === RESULTS.GRANTED) {
        setAllowedLocation(true);
      } else {
        request(permission).then(reqRs => {
          setAllowedLocation(reqRs === RESULTS.GRANTED);
        });
      }
    });
  }, []);

  const shapeData = useMemo(() => {
    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: routeCoordinates,
      },
    };
  }, [routeCoordinates]);

  const onChangeHeight = useCallback((value: number, isTop: boolean) => {
    if (!isTop) {
      setMarginBottom(-value);
    }
  }, []);

  const didFinishLoadingMap = useCallback(() => setFinishLoadingMap(true), []);

  const showErrorDialog = useCallback(() => {
    errorDialogRef.current?.openDialog();
  }, []);

  if (!allowedLocation) {
    return <AccessNotAllowed />;
  }

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={[styles.container]}
        logoPosition={{
          bottom: marginBottom - bottom + 8,
          left: 8,
        }}
        onDidFinishLoadingMap={didFinishLoadingMap}
        attributionPosition={{
          bottom: marginBottom - bottom + 8,
          left: 96,
        }}>
        <Mapbox.Camera ref={cameraRef} />
        {/** Use this in real production */}
        {/* <Mapbox.UserLocation
          minDisplacement={100}
          onUpdate={e => setUserCoordinate(e.coords)}
        /> */}
        {/* @ts-ignore */}
        <Mapbox.ShapeSource id="path" shape={shapeData}>
          <Mapbox.LineLayer id="path_line" style={lineLayerStyle} />
        </Mapbox.ShapeSource>
        <CMarker location={jobInfo.pickUp} type="pickUp" />
        <CMarker location={jobInfo.destination} type="destination" />
      </Mapbox.MapView>
      <MapBackButton />
      <CurrentUserLocation
        paddingBottom={marginBottom}
        onClickCurrentLocation={onMoveMapUserLocation}
      />
      <DetailView
        jobInstance={jobInstance}
        jobInfo={jobInfo}
        onChangeHeight={onChangeHeight}
        showErrorDialog={showErrorDialog}
      />
      <ErrorDialog ref={errorDialogRef} destinationName={jobInfo.pickUp.name} />
    </View>
  );
};

export default JobDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1778F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
