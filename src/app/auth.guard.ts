import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const empId = sessionStorage.getItem('emp_id');

  if (empId) {
    return true;  // ✅ allow access
  } else {
    router.navigate(['/login']);
    return false; // 🚫 block and redirect
  }
};
