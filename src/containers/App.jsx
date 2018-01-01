import React from 'react';
import {
  GoogleMap,
  Marker,
  withScriptjs,
  withGoogleMap,
} from 'react-google-maps';
import { SearchBox } from 'react-google-maps/lib/components/places/SearchBox';

const MyMapComponent = withScriptjs(
  withGoogleMap(() => (
    <GoogleMap defaultZoom={11} defaultCenter={{ lat: 1.3521, lng: 103.8198 }}>
      <SearchBox controlPosition={google.maps.ControlPosition.TOP_LEFT}>
        <input
          type="text"
          placeholder="Customized your placeholder"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            marginTop: `27px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        />
      </SearchBox>
      <Marker position={{ lat: 1.3521, lng: 103.8198 }} />
    </GoogleMap>
  )),
);

const App = () => (
  <MyMapComponent
    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `100vh`, width: '100vw' }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
);

export default App;
