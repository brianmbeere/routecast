import { Router } from "preact-router";
import { routes } from "./routes";

export function App() {
  return (
    <Router>
      {routes.map(({ path, component: Component }) => (
        <Component path={path} />
      ))}
    </Router>
  );
}
