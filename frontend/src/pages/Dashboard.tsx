import { useState, useEffect } from "preact/hooks";
import type { FunctionalComponent } from "preact";
import { onAuthStateChanged, type User as FirebaseUser, signOut } from "firebase/auth";
import { CssBaseline, Box, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../hooks/initializeFirebase";
import DashboardNavigation from "../components/DashboardNavigation";
import DashboardAppBar from "../components/DashboardAppbar";

import RoutePlanner from "./RoutePlanner";
import SavedRoutes from "../components/SavedRoutes";
import SourcingInsights from "../components/ProduceInsights";
import ProduceAnalytics from "../components/ProduceAnalytics";
import ProduceRequestFeed from "../components/ProduceRequestFeed";
import ProduceInventoryManager from "../components/ProduceInventoryManager";
import FarmFinder from "../components/FarmFinder";
import Settings from "../components/Settings";
import { theme } from "../branding";
import { SelectedRequestsProvider } from "../context/SelectedRequestsContext";

const drawerWidth = 240;
const appBarHeight = 64;
const collapsedDrawerWidth = 64;

const Dashboard: FunctionalComponent = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<"farmer" | "restaurant" | null>(null);
  const [loading, setLoading] = useState(true);
    const [drawerExpanded, setDrawerExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        setRole(userDoc.exists() ? userDoc.data().role || null : null);
      } else {
        setRole(null);
      }
    });

    return unsub;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  const getTabContent = () => {
    const farmerTabs = [<ProduceRequestFeed />, <ProduceInventoryManager />, <RoutePlanner />, <SavedRoutes />, <ProduceAnalytics />, <Settings user={user} />];
    const restaurantTabs = [<FarmFinder />, <RoutePlanner />, <SavedRoutes />, <SourcingInsights />, <Settings user={user} />];

    return role === "farmer"
      ? farmerTabs[activeTab] || null
      : role === "restaurant"
      ? restaurantTabs[activeTab] || null
      : null;
  };

  if (loading) return <Box p={3}>Loading...</Box>;
  if (!user) return <Box p={3}>User not signed in.</Box>;

  return (
    <SelectedRequestsProvider>
      <Box sx={{ display: "flex", backgroundColor: theme.palette.background.default }}>
        <CssBaseline />

        {/* AppBar (Fixed at Top) */}
        <Box
          sx={{
              position: "fixed",
              top: 5,
              pr: 2,
              left: {
                xs: 0,
                md: `${drawerExpanded ? drawerWidth : collapsedDrawerWidth}px`,
              },
              width: {
                xs: "100%",
                md: `calc(100% - ${drawerExpanded ? drawerWidth : collapsedDrawerWidth}px)`,
              },
              zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <DashboardAppBar
            isMobile={window.innerWidth < 600}
            onMenuClick={() => setMobileOpen(!mobileOpen)}
            onAccount={() => setActiveTab(5)}
            breadcrumb={{
              title:
                role === "farmer"
                  ? ["Produce Requests", "My Inventory", "Route Optimizer", "Saved Routes", "Analytics", "Settings"][activeTab]
                  : ["Farm Finder", "Route Optimizer", "Saved Routes", "Sourcing Insights", "Settings"][activeTab],
              path: "",
            }}
          />
        </Box>

        {/* Side Navigation Drawer */}
        <DashboardNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobile={window.innerWidth < 600}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          drawerWidth={drawerWidth}
          onLogout={handleLogout}
          onLogoClick={() => setActiveTab(0)}
          setExpanded={setDrawerExpanded}
          expanded={drawerExpanded}
        />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerExpanded ? drawerWidth : 72}px)` },
            ml: { sm: `${drawerExpanded ? drawerWidth : 72}px` },
            mt: `${appBarHeight}px`,
          }}
        >
          <Toolbar /> {/* Spacer to offset fixed AppBar */}
          {getTabContent()}
        </Box>
      </Box>
    </SelectedRequestsProvider>
  );
};

export default Dashboard;
