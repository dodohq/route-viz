import React from 'react';
import {
  GoogleMap,
  Marker,
  withScriptjs,
  withGoogleMap,
  DirectionsRenderer,
} from 'react-google-maps';
import { SearchBox } from 'react-google-maps/lib/components/places/SearchBox';

const MyMapComponent = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={11}
      center={props.center}
      ref={props.onMapMounted}
      onBoundChanged={props.onBoundChanged}
    >
      <SearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={props.onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Customized your placeholder"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            marginTop: `10px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        />
      </SearchBox>
      {props.markers.map(m => (
        <Marker key={`${m.position.lat},${m.position.lng}`} {...m} />
      ))}
      {props.directions.map((d, i) => (
        <DirectionsRenderer key={i} directions={d} />
      ))}
    </GoogleMap>
  )),
);

class App extends React.Component {
  state = {
    center: { lat: 1.3521, lng: 103.8198 },
    markers: [],
    bounds: null,
    directions: [],
  };

  onPlacesChanged = () => {
    const places = this.searchBox.getPlaces();
    const bounds = new google.maps.LatLngBounds();

    places.forEach(place => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    const nextMarkers = places.map(place => ({
      position: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
      label: place.formatted_address,
    }));
    const nextCenter = nextMarkers[0].position || this.state.center;
    if (nextMarkers.length >= 1 && this.state.markers.length >= 1) {
      const directionsService = new google.maps.DirectionsService();
      const lastMarkers = this.state.markers[this.state.markers.length - 1];
      directionsService.route(
        {
          origin: new google.maps.LatLng(
            lastMarkers.position.lat,
            lastMarkers.position.lng,
          ),
          destination: new google.maps.LatLng(nextCenter.lat, nextCenter.lng),
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.setState({
              directions: [...this.state.directions, result],
              center: nextCenter,
              markers: [...this.state.markers, nextMarkers[0]],
            });
          } else {
            console.error(result); // eslint-disable-line no-console
          }
        },
      );
    } else if (nextMarkers.length >= 1) {
      this.setState({
        center: nextCenter,
        markers: [...this.state.markers, nextMarkers[0]],
      });
    }
  };

  onBoundsChanged = () => {
    this.setState({
      bounds: refs.map.getBounds(),
      center: refs.map.getCenter(),
    });
  };

  deleteLocation = idx => {
    const newMarkers = [
      ...this.state.markers.slice(0, idx),
      ...this.state.markers.slice(idx + 1),
    ];
    if (idx === 0) {
      const newDirections = [...this.state.directions.slice(1)];
      this.setState({ markers: newMarkers, directions: newDirections });
    } else if (idx === this.state.markers.length - 1) {
      const newDirections = [
        ...this.state.directions.slice(0, this.state.directions.length - 1),
      ];
      this.setState({ markers: newMarkers, directions: newDirections });
    } else {
      const origin = new google.maps.LatLng(
        this.state.markers[idx - 1].position.lat,
        this.state.markers[idx - 1].position.lng,
      );
      const destination = new google.maps.LatLng(
        this.state.markers[idx + 1].position.lat,
        this.state.markers[idx + 1].position.lng,
      );
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.setState({
              directions: [
                ...this.state.directions.slice(0, idx - 1),
                result,
                ...this.state.directions.slice(idx + 2),
              ],
              markers: newMarkers,
            });
          } else {
            console.error(result); // eslint-disable-line no-console
          }
        },
      );
    }
  };

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <MyMapComponent
          center={this.state.center}
          bounds={this.state.bounds}
          markers={this.state.markers}
          directions={this.state.directions}
          onMapMounted={i => (this.map = i)}
          onSearchBoxMounted={i => (this.searchBox = i)}
          onPlacesChanged={this.onPlacesChanged}
          onBoundsChanged={this.onBoundsChanged}
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh`, width: '80vw' }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        <div
          className="places-list"
          style={{
            width: '20vw',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {this.state.markers.map((m, idx) => (
            <div
              key={`${m.position.lat},${m.position.lng}`}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <p className="place" style={{ marginTop: 0 }}>
                {m.label}
              </p>
              <span
                style={{ color: '#f00' }}
                onClick={() => this.deleteLocation(idx)}
              >
                x
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
