import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'
import "mapbox-gl/dist/mapbox-gl.css";


render(<App />, document.getElementById('app')!)
