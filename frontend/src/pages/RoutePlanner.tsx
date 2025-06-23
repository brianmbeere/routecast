// src/pages/RoutePlanner.tsx
import { useState, useEffect, useRef } from "preact/hooks";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { type FunctionalComponent } from "preact";
import {
  optimizeRoute,
  type OptimizeRouteRequest,
  type OptimizeRouteResponse,
} from "../api/routeoptimize";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const RoutePlanner: FunctionalComponent = () => {
  const [pickup, setPickup] = useState<string>("");
  const [stops, setStops] = useState([{ address: "" }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeRouteResponse | null>(null);

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (result && result.stops.length > 0 && mapContainer.current) {
      // Clean up old map instance
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN;

      const coordinates = result.stops.map((s) => s.location);
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord) => bounds.extend(coord));

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        bounds,
        fitBoundsOptions: { padding: 60 },
      });

      map.addControl(new mapboxgl.NavigationControl());

      // Add markers
      result.stops.forEach((stop, idx) => {
        const [lng, lat] = stop.location;
        new mapboxgl.Marker()
          .setLngLat([lng, lat])
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
              coordinates,
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

        // Fade-in animation
        let opacity = 0;
        const animate = () => {
          opacity = Math.min(opacity + 0.05, 1);
          map.setPaintProperty("route-line", "line-opacity", opacity);
          if (opacity < 1) {
            requestAnimationFrame(animate);
          }
        };
        animate();
      });

      mapRef.current = map;
    }
  }, [result]);

  const handleStopChange = (index: number, value: string) => {
    const updated = [...stops];
    updated[index].address = value;
    setStops(updated);
  };

  const addStop = () => {
    setStops([...stops, { address: "" }]);
  };

  const handleSubmit = async () => {
    const requestPayload: OptimizeRouteRequest = { pickup, stops };
    setLoading(true);
    try {
      const data = await optimizeRoute(requestPayload);
      setResult(data);
    } catch (error) {
      console.error("Route optimization failed:", error);
      alert("Failed to fetch optimized route. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Plan Your Delivery Route
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          label="Pickup Location"
          variant="outlined"
          value={pickup}
          onChange={(e) => setPickup((e.target as HTMLInputElement).value)}
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" gutterBottom>
          Delivery Stops
        </Typography>

        {stops.map((stop, index) => (
          <TextField
            key={index}
            fullWidth
            label={`Stop #${index + 1}`}
            variant="outlined"
            value={stop.address}
            onChange={(e) =>
              handleStopChange(index, (e.target as HTMLInputElement).value)
            }
            sx={{ mb: 2 }}
          />
        ))}

        <Box textAlign="right">
          <Button onClick={addStop} sx={{ mb: 2 }}>
            + Add Another Stop
          </Button>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Optimizing..." : "Generate Route"}
        </Button>
      </Paper>

      {result && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Optimized Route
          </Typography>
          <Box
            ref={mapContainer}
            sx={{ height: "400px", width: "100%", borderRadius: 2, overflow: "hidden", mb: 2 }}
          />
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </Box>
      )}
    </Container>
  );
};

export default RoutePlanner;
