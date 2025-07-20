import { useState } from "preact/hooks";
import { Card, CardContent, Typography, Button, Grid, Box, Chip } from "@mui/material";
import { mockProduceRequests } from "../api/menurithmMockRequests";

const ProduceRequestFeed = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // For now, just log selected requests
  const handleAddToRoute = () => {
    const selectedRequests = mockProduceRequests.filter((req) => selected.includes(req.id));
    // TODO: Pass these to RoutePlanner via context, props, or global state
    alert("Selected requests added to route: " + selectedRequests.map(r => r.restaurantName).join(", "));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Produce Requests from Menurithm</Typography>
      <Grid container spacing={2}>
        {mockProduceRequests.map((req) => (
          <Grid sx={{ xs: 12, md: 6 }} key={req.id}>
            <Card variant={selected.includes(req.id) ? "outlined" : undefined} sx={{ borderColor: selected.includes(req.id) ? 'primary.main' : undefined }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{req.restaurantName}</Typography>
                  <Chip label={req.produce} color="success" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{req.location.address}</Typography>
                <Typography variant="body2">Quantity: {req.quantity}</Typography>
                <Typography variant="body2">Delivery: {req.deliveryWindow}</Typography>
                <Button
                  variant={selected.includes(req.id) ? "contained" : "outlined"}
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleSelect(req.id)}
                  fullWidth
                >
                  {selected.includes(req.id) ? "Selected" : "Add to Route"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selected.length > 0 && (
        <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleAddToRoute}>
          Add Selected Requests to Route
        </Button>
      )}
    </Box>
  );
};

export default ProduceRequestFeed;