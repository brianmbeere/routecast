import { useState } from "preact/hooks";
import {
  Container,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { type FunctionalComponent } from "preact";
import {
  optimizeRoute,
  type OptimizeRouteRequest,
  type OptimizeRouteResponse,
} from "../api/routeoptimize";
import StopInputList from "../components/route/StopInputList";
import MapboxRouteMap from "../components/route/MapboxRouteMap";
import AutocompleteTextField from "../components/route/AutoCompleteTextField";
import { ContentCopyIcon } from '../components/SVGIcons';

const RoutePlanner: FunctionalComponent = () => {
  const [pickup, setPickup] = useState("");
  const [stops, setStops] = useState([{ address: "" }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeRouteResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleStopChange = (index: number, value: string) => {
    const updated = [...stops];
    updated[index].address = value;
    setStops(updated);
  };

  const addStop = () => {
    setStops([...stops, { address: "" }]);
  };

  const removeStop = (index: number) => {
    if (stops.length === 1) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const payload: OptimizeRouteRequest = { pickup, stops };
    setLoading(true);
    try {
      const data = await optimizeRoute(payload);
      setResult(data);
    } catch (error) {
      console.error("Route optimization failed:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Plan Your Delivery Route
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AutocompleteTextField
              label="Pickup Location"
              value={pickup}
              onSelect={setPickup}
            />
            <StopInputList
              stops={stops}
              onChange={handleStopChange}
              onAdd={addStop}
              onRemove={removeStop}
              inputFullWidth
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ mt: 2, width: '100%' }}
            >
              {loading ? "Optimizing..." : "Generate Route"}
            </Button>
          </Box>
          {result && (
            <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Optimized Route
              </Typography>
              <MapboxRouteMap stops={result.stops} />
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  Route Details
                  <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                    <IconButton size="small" onClick={handleCopy} sx={{ ml: 1 }}>
                      <ContentCopyIcon  />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Box
                  sx={{
                    bgcolor: '#1e1e1e',
                    color: '#fff',
                    borderRadius: 1,
                    p: 2,
                    fontFamily: 'monospace',
                    fontSize: 14,
                    overflowX: 'auto',
                    maxHeight: 300,
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  component="pre"
                >
                  {JSON.stringify(result, null, 2)}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
      {/* On mobile, show the JSON result below everything */}
      {result && (
        <Box sx={{ mt: 4, display: { xs: 'block', md: 'none' } }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            Optimized Route Details
            <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
              <IconButton size="small" onClick={handleCopy} sx={{ ml: 1 }}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Typography>
          <Box
            sx={{
              bgcolor: '#1e1e1e',
              color: '#fff',
              borderRadius: 1,
              p: 2,
              fontFamily: 'monospace',
              fontSize: 14,
              overflowX: 'auto',
              maxHeight: 300,
              width: '100%',
              boxSizing: 'border-box',
            }}
            component="pre"
          >
            {JSON.stringify(result, null, 2)}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default RoutePlanner;
