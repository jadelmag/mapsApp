import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
  @ViewChild('txtQuery') txtQuery!: ElementRef;
  private _deboundeTimer?: NodeJS.Timeout;

  constructor(private placesService: PlacesService) {}

  ngOnInit(): void {}

  onQueryChange(query: string = '') {
    if (this._deboundeTimer) clearTimeout(this._deboundeTimer);
    this._deboundeTimer = setTimeout(() => {
      this.placesService.getPlacesByQuery(query);
    }, 500);
  }

  onRemoveTextQuery() {
    this.txtQuery.nativeElement.value = null;
  }
}
