// src/pages/RoutePlanner.tsx
import { useState } from "preact/hooks";
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

const RoutePlanner: FunctionalComponent = () => {
  const [pickup, setPickup] = useState<string>("");
  const [stops, setStops] = useState([{ address: "" }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeRouteResponse | null>(null);

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
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </Box>
      )}
    </Container>
  );
};

export default RoutePlanner;
