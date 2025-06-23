// src/routes.ts
import LandingPage from "./pages/LandingPage";
import RoutePlanner from "./pages/RoutePlanner";

export const routes = [
  { path: "/", component: LandingPage },
  { path: "/plan", component: RoutePlanner },
];
