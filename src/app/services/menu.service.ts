import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuCache: any[] = [];
  private menuSubject = new BehaviorSubject<any[]>([]);
  private isLoading = false;
  private hasLoaded = false;

  constructor(private api: ApiService) {}

  // Get menu data with caching
  getMenu(userId: number): Observable<any[]> {
    // Return cached data if already loaded
    if (this.hasLoaded && this.menuCache.length > 0) {
      return of(this.menuCache);
    }

    // If currently loading, return the subject to wait for completion
    if (this.isLoading) {
      return this.menuSubject.asObservable();
    }

    // Load fresh data
    this.isLoading = true;
    return this.api.getMenu({ user_id: userId }).pipe(
      tap((response: any) => {
        const menus = Array.isArray(response) ? response : response?.data || [];
        this.menuCache = menus;
        this.menuSubject.next(menus);
        this.hasLoaded = true;
        this.isLoading = false;
      }),
      catchError((error) => {
        this.isLoading = false;
        console.error('Failed to load menu:', error);
        return of([]);
      })
    );
  }

  // Get cached menu data synchronously
  getCachedMenu(): any[] {
    return this.menuCache;
  }

  // Check if menu is loaded
  isMenuLoaded(): boolean {
    return this.hasLoaded;
  }

  // Clear cache (useful for logout)
  clearCache(): void {
    this.menuCache = [];
    this.menuSubject.next([]);
    this.hasLoaded = false;
    this.isLoading = false;
  }

  // Get menu as observable for reactive updates
  getMenuObservable(): Observable<any[]> {
    return this.menuSubject.asObservable();
  }
}