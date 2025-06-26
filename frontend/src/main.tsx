import { render } from 'preact'
import './index.css'
import App from './app.tsx'
import "mapbox-gl/dist/mapbox-gl.css";
import { BrowserRouter } from 'react-router-dom'

render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('app')!
)
