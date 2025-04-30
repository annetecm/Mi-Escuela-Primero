import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 20.6736, // Puedes ajustar el centro por defecto (Guadalajara ejemplo)
  lng: -103.344,
};

export default function GoogleMapComponent({ schools }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={8}
      >
        {schools.map((school, idx) => (
          <Marker
            key={idx}
            position={{ lat: parseFloat(school.latitud), lng: parseFloat(school.longitud) }}
            title={school.nombre_escuela}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
