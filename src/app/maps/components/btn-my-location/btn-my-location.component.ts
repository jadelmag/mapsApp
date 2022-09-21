import { Component, OnInit } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css'],
})
export class BtnMyLocationComponent implements OnInit {
  constructor(
    private mapService: MapService,
    private placesService: PlacesService
  ) {}

  ngOnInit(): void {}

  goToMyLocation(): void {
    if (!this.placesService.isUserLocationReady)
      throw Error('No hay ubicación de usuario');
    if (!this.mapService.isMapReady) throw Error('No hay mapa disponible');

    this.mapService.flyTo(this.placesService.userLocation!);
  }
}
