import {
  Drawer, List, ListItem, ListItemText, ListItemIcon,
  Divider, ListItemButton, Button, Toolbar, Box, Tooltip, Typography, IconButton
} from "@mui/material";
import {
  RouteIcon,LogoutIcon,DashboardIcon, DrawerExpandIcon, DrawerCollapseIcon,
  RestaurantIcon,RequestIcon,
} from "./SVGIcons";
import { useTheme } from "@mui/material/styles";
import { brandPalette } from "../branding";
import logo from '../assets/routecast-logo.png';

interface DashboardNavigationProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  drawerWidth: number;
  onLogout: () => void;
  onLogoClick: () => void;
  setExpanded: (expanded: boolean) => void;
  expanded: boolean;
}

const routecastSections = [
  { label: "Produce Requests", icon: (color: string) => <RestaurantIcon style={{ color }} /> },
  { label: "Route Optimizer", icon: (color: string) => <RequestIcon style={{ color }} /> },
  { label: "Saved Routes", icon: (color: string) => <RouteIcon style={{ color }} /> },
  { label: "Delivery Insights", icon: (color: string) => <DashboardIcon style={{ color }} /> },
  { label: "Settings", icon: (color: string) => <DrawerExpandIcon style={{ color }} /> },
];

const COLLAPSED_WIDTH = 64;

const DashboardNavigation = ({
  activeTab,
  setActiveTab,
  isMobile,
  mobileOpen,
  setMobileOpen,
  drawerWidth,
  onLogout,
  onLogoClick,
  setExpanded,
  expanded,
}: DashboardNavigationProps) => {
  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const theme = useTheme();
  
  const currentDrawerWidth = expanded ? drawerWidth : COLLAPSED_WIDTH;

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: 'Inter, Poppins, sans-serif' }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: expanded ? "flex-end" : "center",
          alignItems: "center",
          minHeight: 56,
          px: 1,
        }}
      >
         <IconButton edge="start" onClick={onLogoClick}>
            <img 
              src={logo} 
              alt="Routecast Logo" 
              style={{
                height: 30,
                objectFit: "contain",
              }}
            />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="dashboard"
            style={{
              marginRight: 8,
              display: 'flex',
              fontFamily: theme.typography.fontFamily as string,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            Routecast
          </Typography>      
        {/* 
        <IconButton onClick={handleExpandToggle} size="small" aria-label={expanded ? "Collapse drawer" : "Expand drawer"}>
          {expanded ? <DrawerCollapseIcon /> : <DrawerExpandIcon />}
        </IconButton> 
        */}
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {routecastSections.map((section, index) => {
          const selected = activeTab === index;
          const iconColor = selected ? brandPalette.primary.contrastText : brandPalette.primary.main;
          return (
            <ListItem key={section.label} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={selected}
                onClick={() => {
                  setActiveTab(index);
                  if (isMobile) toggleDrawer();
                }}
                aria-label={`Navigate to ${section.label}`}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  minHeight: 48,
                  justifyContent: expanded ? "initial" : "center",
                  px: 2.5,
                  '&.Mui-selected': {
                    backgroundColor: brandPalette.primary.main,
                    color: brandPalette.primary.contrastText,
                    '& .MuiListItemIcon-root': { color: brandPalette.primary.contrastText },
                  },
                  '&:hover': {
                    backgroundColor: brandPalette.accent.main,
                    color: brandPalette.neutral.main,
                  },
                  fontWeight: 600,
                  fontFamily: 'Inter, Poppins, sans-serif',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: expanded ? 2 : "auto",
                    justifyContent: "center",
                    color: iconColor,
                  }}
                >
                  {section.icon(iconColor)}
                </ListItemIcon>
                {expanded && <ListItemText primary={section.label} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: expanded ? 2: 1, pb: expanded ? 2 : 1, display:"flex", flexDirection:expanded? "row":"column" }} >
        <Tooltip title="Sign out of Routecast" placement={expanded ? "top" : "right"} >
          <Button
            variant="contained"
            fullWidth={expanded}
            startIcon={expanded ? <LogoutIcon /> : undefined}
            onClick={onLogout}
            sx={{
              backgroundColor:  brandPalette.primary.main,
              color: brandPalette.primary.contrastText,
              fontWeight: 600,
              fontFamily: 'Inter, Poppins, sans-serif',
              minWidth: 0,
              px: expanded ? 2 : 1,
              justifyContent: expanded ? "flex-start" : "center",
              '&:hover': { backgroundColor: brandPalette.accent.main, borderColor: brandPalette.primary.main, color: brandPalette.neutral.main}
            }}
          >
            {expanded ? "Logout" : <LogoutIcon />}
          </Button>
        </Tooltip>
        <Tooltip title="Expand or Collapse" sx={{ p: expanded ? 2: 1, pb: expanded ? 2 : 1}}>
          <IconButton 
            sx={{
              minWidth: 0,
              px: expanded ? 2 : 1,
            }}
            onClick={() => setExpanded(!expanded)}
          >
            { expanded ?   <DrawerCollapseIcon /> :  <DrawerExpandIcon /> }
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={toggleDrawer}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: "block", md: "block" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: currentDrawerWidth,
          transition: "width 0.2s",
          backgroundColor: brandPalette.background.paper,
          color: brandPalette.neutral.main,
          fontFamily: 'Inter, Poppins, sans-serif',
          borderRight: "none",
          overflowX: "hidden",
          borderRadius: 0, 
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default DashboardNavigation;