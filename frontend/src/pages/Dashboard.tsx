import { useState, useEffect } from "preact/hooks";
import { type FunctionalComponent } from "preact";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../hooks/initializeFirebase";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  CssBaseline,
  Toolbar,
  AppBar,
  Typography,
  Box,
  IconButton,
  Container
} from "@mui/material";
import { LogoutIcon, MenuIcon } from '../components/SVGIcons';
import RoutePlanner from "./RoutePlanner";
import SavedRoutes from "../components/SavedRoutes";
import SourcingInsights from "../components/ProduceInsights";
import DeliveryInsights from "../components/DeliveryInsights";
import ProduceRequestFeed from "../components/ProduceRequestFeed";
import FarmFinder from "../components/FarmFinder";
import Settings from "../components/Settings";
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../hooks/initializeFirebase";


const drawerWidth = 240;

const Dashboard: FunctionalComponent = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [role, setRole] = useState<"farmer" | "restaurant" | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged (auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.role || null);
        } else {
          setRole(null);
        }
      }else{
        setRole(null);
      }

    });
    return unsub;
  }, []);

  const renderTabContent = () => {
    if (role === "farmer") {
      return {
        home: <ProduceRequestFeed />,
        plan: <RoutePlanner />,
        saved: <SavedRoutes />,
        insights: <DeliveryInsights />,
        settings: <Settings user={user} />,
      }[currentTab];
    } else if (role === "restaurant") {
      return {
        home: <FarmFinder />,
        plan: <RoutePlanner />,
        saved: <SavedRoutes />,
        insights: <SourcingInsights />,
        settings: <Settings user={user} />,
      }[currentTab];
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/signin'); // or navigate to login if you prefer
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItemButton
          selected={currentTab === "home"}
          onClick={() => setCurrentTab("home")}
        >
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton
          selected={currentTab === "plan"}
          onClick={() => setCurrentTab("plan")}
        >
          <ListItemText primary="Route Optimizer" />
        </ListItemButton>
        <ListItemButton
          selected={currentTab === "saved"}
          onClick={() => setCurrentTab("saved")}
        >
          <ListItemText primary="Saved Routes" />
        </ListItemButton>
        <ListItemButton
          selected={currentTab === "insights"}
          onClick={() => setCurrentTab("insights")}
        >
          <ListItemText primary="Route Insights" />
        </ListItemButton>
        <ListItemButton
          selected={currentTab === "settings"}
          onClick={() => setCurrentTab("settings")}
        >
          <ListItemText primary="Settings" />
        </ListItemButton>
        {/* Show logout in drawer only on mobile */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', pl: 2, mt: 2 }}>
          <IconButton color="inherit" onClick={handleLogout} title="Logout">
            <Typography variant="body2" sx={{ mr: 1 }}>Logout</Typography>
            <LogoutIcon />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 1 }}>Logout</Typography>
        </Box>
      </List>
    </div>
  );

  if (loading) return <Container><p>Loading...</p></Container>;
  if (!user) return <Container><p>User not signed in.</p></Container>;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Routecast Dashboard
          </Typography>
          {/* Show logout in app bar only on desktop */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <IconButton color="inherit" onClick={handleLogout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        {renderTabContent()}
      </Box>
    </Box>
  );
}

export default Dashboard;
