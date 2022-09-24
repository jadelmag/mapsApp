import { MapService } from 'src/app/maps/services';
import { Injectable } from '@angular/core';
import { PlacesApiClient } from 'src/app/maps/service-angular';
import {
  Feature,
  PlacesResponse,
} from 'src/app/maps/interfaces/places.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public userLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor(
    private placesApi: PlacesApiClient,
    private mapService: MapService
  ) {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve([coords.longitude, coords.latitude]);
        },
        () => {
          alert('No se pudo obtener la geolocalización.');
          console.log('No se pudo obtener la geolocalización.');
          reject();
        }
      );
    });
  }

  public getPlacesByQuery(query: string = '') {
    if (query.length === 0) {
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }
    if (!this.userLocation) throw Error('No hay userLocation');

    this.isLoadingPlaces = true;
    const url = `/${query}%2Cspain.json`;
    return this.placesApi
      .get<PlacesResponse>(url, {
        params: {
          proximity: 'ip', // this.userLocation?.join(','),
        },
      })
      .subscribe((response) => {
        const features: Feature[] = response.features;
        this.places = features;
        this.isLoadingPlaces = false;
        this.mapService.createMarkers(this.places, this.userLocation!);
      });
  }

  public removePlaces() {
    this.places = [];
  }
}
