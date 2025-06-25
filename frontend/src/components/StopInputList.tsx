import { Box, Button, Typography } from "@mui/material";
import AutocompleteTextField from "./AutoCompleteTextField"; // Adjust path if needed

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
      <Box key={index} sx={{ mb: 2 }}>
        <AutocompleteTextField
          label={`Stop #${index + 1}`}
          value={stop.address}
          onSelect={(val) => onChange(index, val)}
        />
      </Box>
    ))}

    <Box textAlign="right">
      <Button onClick={onAdd} sx={{ mb: 2 }}>
        + Add Another Stop
      </Button>
    </Box>
  </>
);

export default StopInputList;
