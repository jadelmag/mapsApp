import { environment } from 'src/environments/environment';
import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlacesApiClient extends HttpClient {
  public baseUrl: string = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  constructor(handler: HttpHandler) {
    super(handler);
  }

  public override get<T>(
    url: string,
    options: {
      params?:
        | HttpParams
        | {
            [param: string]:
              | string
              | number
              | boolean
              | ReadonlyArray<string | number | boolean>;
          };
    }
  ) {
    url = this.baseUrl + url;
    return super.get<T>(url, {
      params: {
        limit: 5, // 15
        language: 'es',
        types: ['place', 'address'].join(','),
        access_token: environment.mapboxToken,
        ...options.params,
      },
    });
  }
}
