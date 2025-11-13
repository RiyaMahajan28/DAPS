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
  
  // GET STATES
getStates(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}Client/getState`, { headers: this.headers });
}

  // ADD LOCATION
  addLocation(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Client/insertLocation`, data, { headers: this.headers });
  }

    // INSERT STATE
    insertState(data: any): Observable<any> {
      return this.http.post(`${this.baseUrl}Client/insertState`, data, { headers: this.headers });
    }

    // UPDATE STATE
    updateState(data: any): Observable<any> {
      return this.http.post(`${this.baseUrl}Client/updateState`, data, { headers: this.headers });
    }

    // INSERT CITY
    insertCity(data: any): Observable<any> {
      return this.http.post(`${this.baseUrl}Client/insertCity`, data, { headers: this.headers });
    }

    // UPDATE CITY
    updateCity(data: any): Observable<any> {
      return this.http.post(`${this.baseUrl}Client/updateCity`, data, { headers: this.headers });
    }

    // CITY DROP-DOWN (single state or params depending on backend)
    cityDD(body: any): Observable<any> {
      return this.http.post(`${this.baseUrl}Client/cityDD`, body, { headers: this.headers });
    }

    // CITY DROP-DOWN BY MULTI-STATE
    cityDDBByMultiState(body: any): Observable<any> {
      return this.http.post(`${this.baseUrl}Client/cityDDBByMultiState`, body, { headers: this.headers });
    }

    // UPDATE LOCATION
    updateLocation(data: any): Observable<any> {
      return this.http.post(`${this.baseUrl}Client/updateLocation`, data, { headers: this.headers });
    }

// GET CITIES
getCities(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}Client/getCity`, { headers: this.headers });
}

// GET LOCATIONS BY CITY
getLocationByCity(cityId: number): Observable<any[]> {
  const body = { id: cityId };
  return this.http.post<any[]>(`${this.baseUrl}Client/getLocationByCity`, body, {
    headers: this.headers
  });
}

}
