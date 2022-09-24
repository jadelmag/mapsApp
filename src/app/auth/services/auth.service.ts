import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthResponse, User } from 'src/app/auth/interfaces/auth.interfaces';
import { TokenService } from 'src/app/auth/services/token.service';
import { catchError, map, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private _user!: User;

  get user() {
    return { ...this._user };
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string) {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          this.tokenService.token = resp.token!;
        }
      }),
      map((valid) => valid.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  register(name: string, email: string, password: string) {
    const url = `${this.baseUrl}/auth/new`;
    const body = { name, email, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          this.tokenService.token = resp.token!;
        }
      }),
      map((valid) => valid.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  verifyToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renew`;
    return this.http.get<AuthResponse>(url).pipe(
      map((resp) => {
        this.tokenService.token = resp.token!;

        this._user = {
          name: resp.name!,
          uid: resp.uid!,
          email: resp.email!,
        };
        return resp.ok;
      }),
      catchError((err) => of(false))
    );
  }

  logout() {
    localStorage.clear();
  }
}
