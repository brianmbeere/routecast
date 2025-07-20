import { Typography } from "@mui/material";
import { type User } from "firebase/auth";

const Settings = ({ user }: { user: User | null }) => (
  <div>
    <Typography variant="h5">Settings</Typography>
    <Typography variant="body1">Logged in as {user?.email}</Typography>
    {/* Add business info, company, role etc */}
  </div>
);
export default Settings;