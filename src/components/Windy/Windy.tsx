'use client';

type WindyProps = {
  width?: number,
  height?: number,
  zoom?: number,
  lat: number,
  lon: number,
}

const Windy = ({
  width = 650,
  height = 450,
  zoom = 5,
  lat,
  lon,
}: WindyProps) => (
  <iframe
    title="windy-widget"
    width="650"
    height="450"
    src={`https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=${width}&height=${height}&zoom=${zoom}&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=default&metricTemp=default&radarRange=-1`}
    frameBorder="0"
  />
);

export default Windy;
