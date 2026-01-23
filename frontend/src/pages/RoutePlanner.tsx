import { useState, useContext, useEffect } from "preact/hooks";
import { SelectedRequestsContext } from "../context/SelectedRequestsContext";
import {
  Container,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Chip,
  Stack,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { type FunctionalComponent } from "preact";
import {
  optimizeRoute,
  type OptimizeRouteRequest,
  type OptimizeRouteResponse,
} from "../api/routeoptimize";
import { produceRequestApi, type ProduceRequest as BackendProduceRequest } from "../api/produceApi";
import StopInputList from "../components/route/StopInputList";
import MapboxRouteMap from "../components/route/MapboxRouteMap";
import AutocompleteTextField from "../components/route/AutoCompleteTextField";
import { ContentCopyIcon, DeleteIcon } from '../components/SVGIcons';

const RoutePlanner: FunctionalComponent = () => {
  const ctx = useContext(SelectedRequestsContext);
  const [pickup, setPickup] = useState("");
  // If there are selected requests, use their addresses as stops; otherwise, default to one empty stop
  const [stops, setStops] = useState<{ address: string }[]>(
    ctx?.selectedRequests && ctx.selectedRequests.length > 0
      ? ctx.selectedRequests.map(req => ({ address: req.location.address }))
      : [{ address: "" }]
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeRouteResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Accepted orders from backend
  const [acceptedOrders, setAcceptedOrders] = useState<BackendProduceRequest[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<number>>(new Set());
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [removingOrderId, setRemovingOrderId] = useState<number | null>(null);
  const [confirmRemoveDialogOpen, setConfirmRemoveDialogOpen] = useState(false);
  const [orderToRemove, setOrderToRemove] = useState<BackendProduceRequest | null>(null);

  // Load accepted orders on mount
  useEffect(() => {
    loadAcceptedOrders();
  }, []);

  const loadAcceptedOrders = async () => {
    try {
      setLoadingOrders(true);
      setOrdersError(null);
      const orders = await produceRequestApi.getRequests({ status: "accepted" });
      setAcceptedOrders(orders);
      // Auto-select all accepted orders by default
      setSelectedOrderIds(new Set(orders.map(o => o.id)));
    } catch (err) {
      console.error("Failed to load accepted orders:", err);
      setOrdersError("Failed to load accepted orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Toggle order selection
  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrderIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Apply selected orders as stops
  const applySelectedOrdersAsStops = () => {
    const selectedOrders = acceptedOrders.filter(o => selectedOrderIds.has(o.id));
    if (selectedOrders.length === 0) return;
    
    const newStops = selectedOrders.map(order => ({
      address: order.delivery_address
    }));
    setStops(newStops);
  };

  // Open confirmation dialog to remove an accepted order
  const handleRemoveOrderClick = (e: Event, order: BackendProduceRequest) => {
    e.stopPropagation();
    setOrderToRemove(order);
    setConfirmRemoveDialogOpen(true);
  };

  // Close the confirmation dialog
  const handleCloseRemoveDialog = () => {
    setConfirmRemoveDialogOpen(false);
    setOrderToRemove(null);
  };

  // Remove an accepted order (set status back to pending)
  const handleConfirmRemoveOrder = async () => {
    if (!orderToRemove) return;
    
    try {
      setRemovingOrderId(orderToRemove.id);
      await produceRequestApi.updateStatus(orderToRemove.id, "pending");
      
      // Remove from local state
      setAcceptedOrders(prev => prev.filter(o => o.id !== orderToRemove.id));
      setSelectedOrderIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderToRemove.id);
        return newSet;
      });
      
      handleCloseRemoveDialog();
    } catch (err) {
      console.error("Failed to remove order:", err);
      setOrdersError("Failed to remove order. Please try again.");
    } finally {
      setRemovingOrderId(null);
    }
  };

  // If selectedRequests changes, update stops accordingly (but only if not already matching)
  useEffect(() => {
    if (ctx?.selectedRequests && ctx.selectedRequests.length > 0) {
      const selectedAddresses = ctx.selectedRequests.map(req => req.location.address);
      // Only update stops if they don't match the selected addresses
      if (
        stops.length !== selectedAddresses.length ||
        stops.some((stop, i) => stop.address !== selectedAddresses[i])
      ) {
        setStops(selectedAddresses.map(address => ({ address })));
      }
    }
  }, [ctx?.selectedRequests]);

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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Plan Your Delivery Route
      </Typography>

      {/* Accepted Orders Panel */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Accepted Orders
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={loadAcceptedOrders}
              disabled={loadingOrders}
            >
              {loadingOrders ? "Loading..." : "Refresh"}
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              onClick={applySelectedOrdersAsStops}
              disabled={selectedOrderIds.size === 0}
            >
              Use Selected as Stops ({selectedOrderIds.size})
            </Button>
          </Stack>
        </Box>

        {ordersError && (
          <Alert severity="error" sx={{ mb: 2 }}>{ordersError}</Alert>
        )}

        {loadingOrders ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        ) : acceptedOrders.length === 0 ? (
          <Alert severity="info">
            No accepted orders found. Accept produce requests from the Request Feed to see them here.
          </Alert>
        ) : (
          <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
            {acceptedOrders.map((order) => (
              <Box 
                key={order.id} 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  p: 1,
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: selectedOrderIds.has(order.id) ? "action.selected" : "background.paper",
                  border: 1,
                  borderColor: selectedOrderIds.has(order.id) ? "primary.main" : "divider",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" }
                }}
                onClick={() => toggleOrderSelection(order.id)}
              >
                <Checkbox 
                  checked={selectedOrderIds.has(order.id)} 
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Box flex={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle2" fontWeight="bold">
                      {order.restaurant_name}
                    </Typography>
                    <Chip 
                      label={order.produce_type} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`${order.quantity_needed} ${order.unit}`} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    📍 {order.delivery_address}
                  </Typography>
                </Box>
                <Tooltip title="Remove from accepted orders">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => handleRemoveOrderClick(e, order)}
                    disabled={removingOrderId === order.id}
                    sx={{ ml: 1 }}
                  >
                    {removingOrderId === order.id ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Show selected produce requests as stops, if any */}
      {ctx?.selectedRequests && ctx.selectedRequests.length > 0 && (
        <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Selected Produce Requests:
          </Typography>
          {ctx.selectedRequests.map((req) => (
            <Box key={req.id} sx={{ mb: 1 }}>
              <strong>{req.restaurantName}</strong> — {req.produce} — {req.location.address}
            </Box>
          ))}
        </Paper>
      )}

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

      {/* Confirmation Dialog for Removing Accepted Order */}
      <Dialog
        open={confirmRemoveDialogOpen}
        onClose={handleCloseRemoveDialog}
        aria-labelledby="remove-order-dialog-title"
        aria-describedby="remove-order-dialog-description"
      >
        <DialogTitle id="remove-order-dialog-title">
          Remove Accepted Order?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="remove-order-dialog-description">
            Are you sure you want to remove the order from <strong>{orderToRemove?.restaurant_name}</strong> for{" "}
            <strong>{orderToRemove?.quantity_needed} {orderToRemove?.unit}</strong> of{" "}
            <strong>{orderToRemove?.produce_type}</strong>?
            <br /><br />
            This will set the order status back to pending and it will appear in the request feed again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemoveDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmRemoveOrder} 
            color="error" 
            variant="contained"
            disabled={removingOrderId !== null}
          >
            {removingOrderId !== null ? "Removing..." : "Remove Order"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoutePlanner;
