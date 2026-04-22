import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseHttpService {
  private baseUrl: string = environment.firebaseConfig.databaseURL;

  constructor(private http: HttpClient) {}

  get(path: string): Promise<any> {
    const url = `${this.baseUrl}/${path}.json`;
    return firstValueFrom(this.http.get(url));
  }

  put(path: string, data: any): Promise<void> {
    const url = `${this.baseUrl}/${path}.json`;
    return firstValueFrom(this.http.put(url, data)).then(() => {});
  }

  post(path: string, data: any): Promise<any> {
    const url = `${this.baseUrl}/${path}.json`;
    return firstValueFrom(this.http.post(url, data));
  }

  delete(path: string): Promise<void> {
    const url = `${this.baseUrl}/${path}.json`;
    return firstValueFrom(this.http.delete(url)).then(() => {});
  }

  postFullUrl(url: string, data: any): Promise<any> {
    return firstValueFrom(this.http.post(url, data));
  }
}
