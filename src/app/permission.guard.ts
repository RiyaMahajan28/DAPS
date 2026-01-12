import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MenuService } from './services/menu.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const permissionGuard: CanActivateFn = (route, state) => {
  // Always allow dashboard for all users
  if (state.url === '/dashboard' || state.url === 'dashboard') {
    return true;
  }
  const router = inject(Router);
  const menuService = inject(MenuService);
  
  const empId = sessionStorage.getItem('emp_id');
  
  if (!empId) {
    router.navigate(['/login']);
    return false;
  }

  // Get the route path to check permissions
  const routePath = state.url;
  
  // If menu is already loaded, use cached data synchronously
  if (menuService.isMenuLoaded()) {
    const cachedMenus = menuService.getCachedMenu();
    const hasPermission = checkRoutePermission(cachedMenus, routePath);
    
    if (!hasPermission) {
      router.navigate(['/unauthorized']);
      return false;
    }
    
    return true;
  }
  
  // If menu is not loaded, fetch it and then check permissions
  return menuService.getMenu(Number(empId)).pipe(
    map((menus: any[]) => {
      // Check if user has permission for this route
      const hasPermission = checkRoutePermission(menus, routePath);
      
      if (!hasPermission) {
        // Redirect to unauthorized page
        router.navigate(['/unauthorized']);
        return false;
      }
      
      return true;
    }),
    catchError(() => {
      // If there's an error fetching menus, deny access
      router.navigate(['/login']);
      return of(false);
    })
  );
};

function checkRoutePermission(menus: any[], routePath: string): boolean {
  const normalizedPath = routePath.startsWith('/') ? routePath.substring(1) : routePath;
  
  // Extract base path from routes with parameters (e.g., 'add-state/123' -> 'add-state')
  const basePath = normalizedPath.split('/')[0];
//   console.log('Checking permission for normalized path:', normalizedPath, 'Base path:', basePath);

  const routePermissions: { [key: string]: string[] } = {
    'record-form': ['add client', 'client form', 'new client'],
    'records': ['view client', 'client list', 'clients'],
    'state-list': ['view state', 'state list', 'states'],
    'add-state': ['add state', 'state form', 'new state'],
    'add-user': ['add user', 'user form', 'new user'],
    'location': ['location', 'locations'],
    'dashboard': ['dashboard', 'home']
  };

  const requiredPermissions = routePermissions[basePath];

  if (!requiredPermissions) {
    console.log(`No specific permissions defined for route: ${basePath}`);
    return false;
  }

//   console.log('Required permissions for', basePath, ':', requiredPermissions);

  const hasPermission = menus.some(menu => {
    const menuName = (menu.menu_Name || menu.Menu_Name || menu.MenuName || '').toLowerCase();
    // console.log('Checking main menu item:', menuName);

    // Check if the main menu item itself grants permission
    if (requiredPermissions.some(permission => menuName.includes(permission))) {
      console.log(`Permission granted by main menu item: ${menuName}`);
      return true;
    }

    // Check sub-menus if they exist
    if (menu.subMenu && Array.isArray(menu.subMenu)) {
    //   console.log('Checking sub-menus for:', menuName);
      return menu.subMenu.some((subMenuItem: any) => {
        const subMenuName = (subMenuItem.menu_Name || subMenuItem.Menu_Name || subMenuItem.MenuName || '').toLowerCase();
        // console.log('Checking sub-menu item:', subMenuName);
        
        return requiredPermissions.some(permission => subMenuName.includes(permission));
      });
    }

    return false;
  });

//   console.log('Final permission result:', hasPermission);
  return hasPermission;
}
