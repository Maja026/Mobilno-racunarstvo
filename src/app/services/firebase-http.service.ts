import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseHttpService {
  private baseUrl: string = environment.firebaseConfig.databaseURL;

  constructor(private http: HttpClient) {}

  get(path: string): Promise<any> {
    const url = `${this.baseUrl}/${path}.json`;
    return this.http.get(url).toPromise();
  }

  put(path: string, data: any): Promise<void> {
    const url = `${this.baseUrl}/${path}.json`;
    return this.http.put(url, data).toPromise().then(() => {});
  }

  post(path: string, data: any): Promise<any> {
    const url = `${this.baseUrl}/${path}.json`;
    return this.http.post(url, data).toPromise();
  }

  delete(path: string): Promise<void> {
    const url = `${this.baseUrl}/${path}.json`;
    return this.http.delete(url).toPromise().then(() => {});
  }
}
