import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private _token!: string;

  get token() {
    return this._token;
  }

  set token(currentToken: string) {
    this._token = currentToken;
    localStorage.setItem('token', currentToken);
  }

  constructor() {
    const token: string | null = localStorage.getItem('token');
    if (token) {
      this._token = token;
    }
  }
}
