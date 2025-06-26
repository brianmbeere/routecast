import { Router } from "preact-router";
import { type FunctionalComponent } from "preact";
import { routes } from "./routes";
import PrivateRoute  from "./auth/PrivateRoute";

const App: FunctionalComponent = () => {
  return (
    <Router>
      {routes.map(({ path, component: Component, protected: isProtected }) => {
        const Wrapped = isProtected
          ? (props: any) => <PrivateRoute><Component {...props} /></PrivateRoute>
          : Component;
        return <Wrapped path={path} key={path} />;
      })}
    </Router>
  );
}

export default App;