import {MAPBOX_PUBLIC_APK} from '../utils/constants';

export const getRoute = async (
  pickUp: [number, number],
  destination: [number, number],
) => {
  const fetchRs = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${pickUp[0]},${pickUp[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${MAPBOX_PUBLIC_APK}`,
  );
  const jsonRs = await fetchRs.json();
  const coordinates = jsonRs.routes?.[0]?.geometry?.coordinates ?? [];
  return coordinates as [[number, number]];
};
