import { useRef, useEffect, useState } from "preact/hooks";
import { Box } from "@mui/material";
import { useMapbox } from "../hooks/useMapbox";

type Stop = {
  address: string;
  location: [number, number];
};

type Props = {
  stops: Stop[];
};

const MapboxRouteMap = ({ stops }: Props) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useMapbox({
    container: mounted ? mapContainer.current : null,
    stops,
    accessToken: import.meta.env.VITE_MAP_BOX_API_TOKEN,
  });

  return (
    <Box
      ref={mapContainer}
      sx={{
        height: "400px",
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        mb: 2,
      }}
    />
  );
};

export default MapboxRouteMap;
