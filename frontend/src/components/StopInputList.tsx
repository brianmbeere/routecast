import { TextField, Box, Button, Typography } from "@mui/material";

type Stop = { address: string };
type Props = {
  stops: Stop[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
};

const StopInputList = ({ stops, onChange, onAdd }: Props) => (
  <>
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
        onChange={(e) => onChange(index, (e.target as HTMLInputElement).value)}
        sx={{ mb: 2 }}
      />
    ))}

    <Box textAlign="right">
      <Button onClick={onAdd} sx={{ mb: 2 }}>
        + Add Another Stop
      </Button>
    </Box>
  </>
);

export default StopInputList;
