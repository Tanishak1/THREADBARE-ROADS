import { useEffect, useMemo, useState } from 'react'
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  PolylineF,
  useJsApiLoader,
} from '@react-google-maps/api'

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }
const MONUMENT_COLOR = '#C1121F'
const LOCAL_VENDOR_COLOR = '#2A9D8F'
const MAP_CONTAINER_STYLE = { width: '100%', height: '480px' }

function isValidWaypoint(waypoint) {
  return Number.isFinite(Number(waypoint.lat)) && Number.isFinite(Number(waypoint.lng))
}

function isMonument(waypoint) {
  const category = String(waypoint.category || waypoint.type || '').toLowerCase()
  return category.includes('monument') || category.includes('heritage')
}

function markerIcon(color) {
  return {
    path: 'M 0,-1 a 1,1 0 1,0 2,0 a 1,1 0 1,0 -2,0',
    fillColor: color,
    fillOpacity: 1,
    scale: 9,
    strokeColor: '#FDF7E3',
    strokeWeight: 2,
  }
}

export default function ItineraryMap({ waypoints = [] }) {
  const [selectedWaypoint, setSelectedWaypoint] = useState(null)
  const [map, setMap] = useState(null)
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'itinerary-map',
    googleMapsApiKey: apiKey || '',
  })

  const validWaypoints = useMemo(
    () =>
      waypoints
        .filter(isValidWaypoint)
        .map((waypoint, index) => ({
          ...waypoint,
          lat: Number(waypoint.lat),
          lng: Number(waypoint.lng),
          id: waypoint.id || `${waypoint.name || 'waypoint'}-${index}`,
        })),
    [waypoints]
  )

  useEffect(() => {
    if (!map || !window.google || validWaypoints.length === 0) return

    const bounds = new window.google.maps.LatLngBounds()
    validWaypoints.forEach((waypoint) => bounds.extend(waypoint))
    map.fitBounds(bounds, 64)
  }, [map, validWaypoints])

  if (!apiKey) {
    return (
      <div className="border border-vermillion/30 bg-paper p-5 text-sm text-vermillion" role="alert">
        Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to the frontend environment to display the itinerary map.
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="border border-vermillion/30 bg-paper p-5 text-sm text-vermillion" role="alert">
        The itinerary map could not be loaded. Check the Google Maps API key and enabled APIs.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="h-[480px] flex items-center justify-center bg-night text-paper" aria-live="polite">
        Loading itinerary map...
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={validWaypoints[0] || DEFAULT_CENTER}
        zoom={validWaypoints.length > 0 ? 12 : 5}
        onLoad={setMap}
        onUnmount={() => setMap(null)}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        {validWaypoints.map((waypoint, index) => (
          <MarkerF
            key={waypoint.id}
            position={waypoint}
            title={waypoint.name || `Stop ${index + 1}`}
            icon={markerIcon(isMonument(waypoint) ? MONUMENT_COLOR : LOCAL_VENDOR_COLOR)}
            label={{
              text: String(index + 1),
              color: '#FDF7E3',
              fontSize: '11px',
              fontWeight: '700',
            }}
            onClick={() => setSelectedWaypoint(waypoint)}
          />
        ))}

        {selectedWaypoint && (
          <InfoWindowF
            position={selectedWaypoint}
            onCloseClick={() => setSelectedWaypoint(null)}
          >
            <div className="max-w-[220px] text-ink">
              <strong>{selectedWaypoint.name || 'Itinerary stop'}</strong>
              {selectedWaypoint.category && (
                <p className="mt-1 text-xs text-ink/60">{selectedWaypoint.category}</p>
              )}
            </div>
          </InfoWindowF>
        )}

        {validWaypoints.length > 1 && (
          <PolylineF
            path={validWaypoints}
            options={{
              strokeColor: '#14213D',
              strokeOpacity: 0.8,
              strokeWeight: 3,
              geodesic: true,
            }}
          />
        )}
      </GoogleMap>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink/70" aria-label="Map legend">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-vermillion" aria-hidden="true" />
          Monuments
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-teal" aria-hidden="true" />
          Local artisans / food vendors
        </span>
      </div>
    </div>
  )
}