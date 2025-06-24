import { useEffect, useRef } from "preact/hooks";
import mapboxgl from "mapbox-gl";

type Stop = {
  address: string;
  location: [number, number]; // [lng, lat]
};

type UseMapboxOptions = {
  container: HTMLDivElement | null;
  stops: Stop[];
  accessToken: string;
};

export function useMapbox({ container, stops, accessToken }: UseMapboxOptions) {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!container || stops.length === 0) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    mapboxgl.accessToken = accessToken;

    const bounds = new mapboxgl.LngLatBounds();
    stops.forEach((s) => bounds.extend(s.location));

    const map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/mapbox/streets-v11",
      bounds,
      fitBoundsOptions: { padding: 60 },
    });

    map.addControl(new mapboxgl.NavigationControl());

    stops.forEach((stop, idx) => {
      new mapboxgl.Marker()
        .setLngLat(stop.location)
        .setPopup(new mapboxgl.Popup().setText(`${idx + 1}. ${stop.address}`))
        .addTo(map);
    });

    map.on("load", () => {
  map.addSource("route", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: stops.map((s) => s.location),
      },
    },
  });

  map.addLayer({
    id: "route-line",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#3b82f6",
      "line-width": 4,
      "line-opacity": 0,
    },
  });

  let opacity = 0;
  const animate = () => {
    opacity = Math.min(opacity + 0.05, 1);
    if (map.getLayer("route-line")) {
      map.setPaintProperty("route-line", "line-opacity", opacity);
    }
    if (opacity < 1) requestAnimationFrame(animate);
  };
    animate();
  });


  mapRef.current = map;
  }, [container, stops, accessToken]);

  return mapRef;
}
