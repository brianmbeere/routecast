import { useState, useEffect } from "preact/hooks";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";

type Props = {
  label: string;
  value: string;
  onSelect: (value: string) => void;
};

const MAP_BOX_TOKEN = import.meta.env.VITE_MAP_BOX_API_TOKEN;

const AutocompleteTextField = ({ label, value, onSelect }: Props) => {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputDirty, setInputDirty] = useState(false); 

  useEffect(() => {
    const controller = new AbortController();

    const fetchSuggestions = async () => {
      if (!value || !inputDirty) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value
          )}.json?access_token=${MAP_BOX_TOKEN}&autocomplete=true&limit=5`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Mapbox API request failed");

        const data = await res.json();
        const placeNames = data.features.map((f: any) => f.place_name);
        setOptions(placeNames);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Autocomplete error:", err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [value, inputDirty]);

  return (
    <Autocomplete
      freeSolo
      blurOnSelect
      options={options}
      inputValue={value}
      onInputChange={(_, newInput, reason) => {
        onSelect(newInput);
        if (reason === "input") setInputDirty(true);
      }}
      onChange={(_, newValue) => {
        if (typeof newValue === "string") {
          onSelect(newValue);
          setOptions([]);
          setInputDirty(false); 
        }
      }}
      open={inputDirty && value.length > 0 && options.length > 0}
      renderOption={(props, option) => <li {...props}>{option}</li>}
      renderInput={(params) => (
        <TextField
          {...(params as any)}
          label={label}
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AutocompleteTextField;
