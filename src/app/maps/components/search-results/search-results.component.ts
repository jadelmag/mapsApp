import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MapService, PlacesService } from 'src/app/maps/services';
import { Feature } from 'src/app/maps/interfaces/places.interfaces';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent {
  @Output() onClearResults: EventEmitter<boolean> = new EventEmitter();
  public selectedId: string = '';

  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) {}

  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[] {
    return this.placesService.places;
  }

  flyTo(place: Feature) {
    this.selectedId = place.id;
    const [lng, lat] = place.center;
    this.mapService.flyTo([lng, lat]);
  }

  generateRoute(place: Feature) {
    if (!this.placesService.userLocation) throw Error('No hay user location.');
    this.onClearResults.emit(true);
    this.placesService.removePlaces();
    const start = this.placesService.userLocation!;
    const end = place.center as [number, number];
    this.mapService.getRouteBetweenTwoPoints(start, end);
  }
}
