import { Injectable, OnDestroy } from '@angular/core';
import {
  AnySourceData,
  LngLatBounds,
  LngLatLike,
  Map,
  Marker,
  Popup,
} from 'mapbox-gl';
import { DirectionsApiClient } from 'src/app/maps/api';
import { Feature } from 'src/app/maps/interfaces/places.interfaces';
import {
  DirectionResponse,
  Route,
} from 'src/app/maps/interfaces/directions.interfaces';

@Injectable({
  providedIn: 'root',
})
export class MapService implements OnDestroy {
  private _map?: Map;
  private _markers: Marker[] = [];

  get isMapReady() {
    return !!this._map;
  }

  constructor(private directionsApi: DirectionsApiClient) {}

  ngOnDestroy(): void {
    this._map?.off('mouseover', () => {});
    this._map?.off('mouseout', () => {});
  }

  setMap(map: Map): void {
    this._map = map;
  }

  flyTo(coords: LngLatLike): void {
    if (!this.isMapReady) throw Error('El mapa no está listo');
    this._map?.flyTo({
      center: coords,
      zoom: 14,
    });
  }

  createMarkers(places: Feature[], userLocation: [number, number]): void {
    if (!this._map) throw Error('Mapa no inicializado');
    this._markers.forEach((marker) => marker.remove());

    const newMarkers: Marker[] = [];
    for (const place of places) {
      const [lng, lat] = place.center;

      const popup: Popup = new Popup().setHTML(
        `<h6>${place.text}</h6><span>${place.place_name}</span>`
      );
      const newMarker: Marker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this._map);
      newMarkers.push(newMarker);
    }

    this._markers = newMarkers;
    if (places.length === 0) return;
    this.centerWithMarkers(newMarkers, userLocation);
  }

  centerWithMarkers(markers: Marker[], userLocation: [number, number]): void {
    const bounds = new LngLatBounds();
    markers.forEach((marker) => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);
    this._map?.fitBounds(bounds, {
      padding: 200,
    });
  }

  getRouteBetweenTwoPoints(start: [number, number], end: [number, number]) {
    this.directionsApi
      .get<DirectionResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe((resp) => this.drawPolyline(resp.routes[0]));
  }

  private drawPolyline(route: Route) {
    if (!this._map) throw Error('Mapa no inicializado');

    const coords = route.geometry.coordinates;
    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));

    this._map?.fitBounds(bounds, {
      padding: 200,
    });

    this.drawOnMap(coords);

    const kms = route.distance / 1000;
    const duration = route.duration / 60;
    this.showInfoRoute(this._map, kms, duration);
  }

  private drawOnMap(coords: number[][]): void {
    if (this._map?.getLayer('RouteString')) {
      this._map.removeLayer('RouteString');
      this._map.removeSource('RouteString');
    }

    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          },
        ],
      },
    };

    this._map?.addSource('RouteString', sourceData);
    this._map?.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'black',
        'line-width': 3,
      },
    });
  }

  private showInfoRoute(map: Map, kms: number, duration: number) {
    let popup: Popup | undefined = undefined;
    this._map?.on('mouseover', 'RouteString', (e) => {
      popup = new Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `<span>Kms: ${kms}</span><br/>
          <span>Duración:${Math.round(duration)} minutos.</span>`
        )
        .addTo(map);
    });

    this._map?.on('mouseout', 'RouteString', () => {
      if (popup) popup.remove();
    });
  }
}
