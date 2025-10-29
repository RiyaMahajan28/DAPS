import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

private baseUrl = 'http://northeyeapi.thedaps.com/';

  private headers = new HttpHeaders()
    .set('NorthEyeApiKey', '1')
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

  constructor(private http: HttpClient) {}

  // LOGIN
  login(data: { emp_code: string; emp_password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}Client/Login`, data, { headers: this.headers });
  }

  // GET CLIENTS
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}Client/getClient`, { headers: this.headers });
  }

  // ADD CLIENT
  addClient(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Client/insertClient`, data, { headers: this.headers });
  }

  // UPDATE CLIENT
  updateClient(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Client/updateClient`, data, { headers: this.headers });
  }
  
}
