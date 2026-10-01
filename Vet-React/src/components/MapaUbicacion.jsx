import { MapContainer, TileLayer, Marker, AttributionControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const posicion = [-34.1708, -70.7444]

const pinRojo = L.divIcon({
    className: 'pin-rojo',
    html: `<svg viewBox="0 0 24 36" width="28" height="42" xmlns="http://www.w3.org/2000/svg">
        <path fill="#e53935" stroke="#7f1d1d" stroke-width="1"
            d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"/>
        <circle cx="12" cy="12" r="4.5" fill="white"/>
    </svg>`,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
})

function MapaUbicacion() {
    return (
        <MapContainer
            center={posicion}
            zoom={15}
            scrollWheelZoom={false}
            attributionControl={false}
            className="footer-map"
        >
            <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
            />
            <Marker position={posicion} icon={pinRojo} />
            <AttributionControl prefix={false} position="bottomright" />
        </MapContainer>
    )
}

export default MapaUbicacion