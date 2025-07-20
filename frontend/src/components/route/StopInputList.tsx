import { Box, Button, Typography, IconButton } from "@mui/material";
import AutocompleteTextField from "./AutoCompleteTextField";
import {RemoveCircleOutlineIcon} from '../SVGIcons';

type Stop = { address: string };
type Props = {
  stops: Stop[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  inputFullWidth?: boolean;
};

const StopInputList = ({ stops, onChange, onAdd, onRemove }: Props) => (
  <>
    <Typography variant="h6" gutterBottom>
      Delivery Stops
    </Typography>

    {stops.map((stop, index) => (
      <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <AutocompleteTextField
            label={`Stop #${index + 1}`}
            value={stop.address}
            onSelect={(val) => onChange(index, val)}
          />
        </Box>
        {stops.length > 1 && (
          <IconButton aria-label="Remove stop" color="error" onClick={() => onRemove(index)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        )}
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
