import { Routes, Route } from "react-router-dom";
import { type FunctionalComponent } from "preact";
import { routes } from "./routes";
import PrivateRoute from "./auth/PrivateRoute";

const App: FunctionalComponent = () => {
  return (
    <Routes>
      {routes.map(({ path, component: Component, protected: isProtected }) => {
        const element = isProtected
          ? <PrivateRoute><Component /></PrivateRoute>
          : <Component />;
        return <Route path={path} element={element} key={path} />;
      })}
    </Routes>
  );
};

export default App;