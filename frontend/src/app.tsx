import { Routes, Route } from "react-router-dom";
import { type FunctionalComponent } from "preact";
import { routes } from "./routes";
import PrivateRoute from "./auth/PrivateRoute";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./branding";

const App: FunctionalComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Routes>
          {routes.map(({ path, component: Component, protected: isProtected }) => {
            const element = isProtected
              ? <PrivateRoute><Component /></PrivateRoute>
              : <Component />;
            return <Route path={path} element={element} key={path} />;
          })}
        </Routes>
    </ThemeProvider>
  );
};

export default App;