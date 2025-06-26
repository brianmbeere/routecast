// src/routes.ts
import LandingPage from "./pages/LandingPage";
import RoutePlanner from "./pages/RoutePlanner";
import Dashboard from "./pages/Dashboard";
import SignUpForm from "./components/SignUpForm";
import SignInForm from "./components/SignInForm";

export const routes = [
  { path: "/", component: LandingPage },
   { path: "/signup", component: SignUpForm },
  { path: "/signin", component: SignInForm },
  { path: "/plan", component: RoutePlanner, protected: true },
  { path: "/dashboard", component: Dashboard, protected: true }
];
