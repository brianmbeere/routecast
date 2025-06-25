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
    const allCoords = stops.map((s) => s.location);
    const routeSourceId = "route";

    // Initialize with first point only
    map.addSource(routeSourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [allCoords[0]],
        },
      },
    });

    map.addLayer({
      id: "route-line",
      type: "line",
      source: routeSourceId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#3b82f6",
        "line-width": 4,
      },
    });

    // Animate drawing of the line
    let index = 2;

    const animateLine = () => {
      const nextCoords = allCoords.slice(0, index);
      const source = map.getSource(routeSourceId) as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: nextCoords,
          },
        });
      }

      if (index < allCoords.length + 1) {
        index++;
        requestAnimationFrame(animateLine);
      }
    };

    animateLine();
  });
  
  mapRef.current = map;
  }, [container, stops, accessToken]);

  return mapRef;
}
