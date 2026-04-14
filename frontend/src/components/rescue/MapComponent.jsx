//src/components/rescue/MapComponent.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet markers in React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for PetCare theme
const createCustomIcon = (color) => new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const rescueIcon = createCustomIcon('#8b6b4c');
const volunteerIcon = createCustomIcon('#5f7d5a');
const activeIcon = createCustomIcon('#7fa37a');

// Helper to center map
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && 
        typeof center[0] === 'number' && typeof center[1] === 'number' &&
        !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

// Map events handler for clicking/pinning
const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

const MapComponent = ({ 
  center = [23.8103, 90.4125], // Default Dhaka center
  zoom = 13, 
  markers = [], 
  onMapClick, 
  onMarkerDrag,
  isDraggable = false,
  height = "100%" 
}) => {
  return (
    <div style={{ height, width: "100%", borderRadius: "1.5rem", overflow: "hidden" }} className="leaflet-custom-container">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <ChangeView center={center} zoom={zoom} />
        <MapEvents onMapClick={onMapClick} />

        {markers.map((marker, idx) => (
          <Marker 
            key={idx} 
            position={[marker.lat, marker.lng]}
            icon={marker.type === 'volunteer' ? volunteerIcon : (marker.type === 'active' ? activeIcon : rescueIcon)}
            draggable={isDraggable && marker.isMain}
            eventHandlers={{
                dragend: (e) => {
                    if (onMarkerDrag) onMarkerDrag(e.target.getLatLng());
                }
            }}
          >
            {marker.label && (
              <Popup className="glass-popup">
                <div className="font-semibold text-[#2f3e2c]">{marker.label}</div>
                {marker.description && <div className="text-xs text-[#4e5f4a] mt-1">{marker.description}</div>}
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>

      <style>{`
        .leaflet-container {
          background: #f3eee8 !important;
        }
        .glass-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(139, 107, 76, 0.3);
          border-radius: 12px;
          padding: 4px;
        }
        .glass-popup .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(10px);
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out {
          background: rgba(255, 255, 255, 0.7) !important;
          backdrop-filter: blur(5px) !important;
          color: #4e5f4a !important;
          border: 1px solid rgba(139, 107, 76, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
