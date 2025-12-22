// import { Component, EventEmitter, Output, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { ApiService } from '../../services/api.service';

// @Component({
//   selector: 'app-sidebar',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './sidebar.component.html',
//   styleUrl: './sidebar.component.css'
// })
// export class SidebarComponent implements OnInit {

//  @Output() collapsedChange = new EventEmitter<boolean>();
 

//   isCollapsed = false;
//   menus: any[] = [];
//   loading = false;
//   error: string | null = null;
//   // groupedMenus will be an array of { idKey: string, name: string, items: any[] }
//   groupedMenus: Array<{ idKey: string; name: string; items: any[] }> = [];
//   // track expanded groups (no navigation for now)
//   expanded = new Set<string>();

//   constructor(private router: Router, private api: ApiService) {}

//   ngOnInit(): void {
//     this.loadMenu();
//   }

//   toggleGroup(idKey: string) {
//     if (this.expanded.has(idKey)) {
//       this.expanded.delete(idKey);
//     } else {
//       this.expanded.add(idKey);
//     }
//     // force change detection friendly update by creating a new Set reference
//     this.expanded = new Set(Array.from(this.expanded));
//   }

//   private loadMenu(): void {
//     this.loading = true;
//     this.error = null;

//     // Try to read emp_id saved at login; default to 1 if missing
//     const empIdRaw = sessionStorage.getItem('emp_id');
//     const empId = empIdRaw ? Number(empIdRaw) : 1;

//     const body = { user_id: empId };
//     this.api.getMenu(body).subscribe({
//       next: (res: any) => {
//         // backend may return array or { data: [...] }
//         this.menus = Array.isArray(res) ? res : (res?.data || []);
//         // The API can return two shapes:
//         // 1) flat list where each item has Menu_Name and ParantName (first sample)
//         // 2) hierarchical list where top-level items include `subMenu` array (second sample)
//         if (this.menus.length > 0 && Object.prototype.hasOwnProperty.call(this.menus[0], 'subMenu')) {
//           // use the hierarchical structure directly
//           this.groupedMenus = this.menus.map((m: any) => ({
//             idKey: `id-${m.menu_id || m.Menu_id || m.MenuID || m.id || Math.random()}`,
//             name: m.menu_Name || m.Menu_Name || m.menuName || m.MenuName || m.Menu || 'Unnamed',
//             items: m.subMenu || m.sub_menu || []
//           }));
//         } else {
//           // build grouping by parent name (API sample uses 'ParantName')
//           const groups: { [key: string]: any[] } = {};
//           this.menus.forEach((m: any) => {
//             const parent = m.ParantName || m.ParentName || 'Root';
//             if (!groups[parent]) groups[parent] = [];
//             groups[parent].push(m);
//           });
//           this.groupedMenus = Object.keys(groups).map(k => ({
//             idKey: `name-${k}`,
//             name: k,
//             items: groups[k]
//           }));
//         }
//         this.loading = false;
//       },
//       error: (err: any) => {
//         console.error('Failed to load menu', err);
//         this.error = 'Failed to load menu';
//         this.loading = false;
//       }
//     });
//   }

//   // constructor(private router: Router, private sidebarService : SidebarService) {
//   //   const savedState = sessionStorage.getItem('sidebar-collapsed');
//   //   this.isCollapsed = savedState === 'true';
//   // }

//   toggleSidebar(): void {
//       // this.sidebarService.toggle();
//     this.isCollapsed = !this.isCollapsed;
//     sessionStorage.setItem('sidebar-collapsed', this.isCollapsed.toString());
//     this.collapsedChange.emit(this.isCollapsed);   // <-- Send event to parent
//   }

//   navigateTo(path: string) {
//     this.router.navigate([path]);
//   }
//    logout(): void {
//   // Clear all local data
//   sessionStorage.clear();

//   // Prevent browser back navigation
//   history.pushState(null,'',window.location.href);
//   window.onpopstate = function(){
//     history.go(1);
//   }

//   // Navigate back to login page (adjust route if different)
//   this.router.navigate(['/login']).then(()=>{
//     window.location.reload()
//   });

//   console.log('User logged out successfully');
// }
// }
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  @Output() collapsedChange = new EventEmitter<boolean>();

  isCollapsed = false;
  menus: any[] = [];
  loading = false;
  error: string | null = null;

  groupedMenus: Array<{
    idKey: string;
    name: string;
    items: any[];
  }> = [];

  expanded = new Set<string>();

  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    sessionStorage.setItem('sidebar-collapsed', this.isCollapsed.toString());
    this.collapsedChange.emit(this.isCollapsed);
  }

  toggleGroup(idKey: string) {
    if (this.expanded.has(idKey)) {
      this.expanded.delete(idKey);
    } else {
      this.expanded.add(idKey);
    }
    this.expanded = new Set(this.expanded);
  }

  private loadMenu(): void {
    this.loading = true;
    this.error = null;

    const empId = Number(sessionStorage.getItem('emp_id')) || 1;

    this.api.getMenu({ user_id: empId }).subscribe({
      next: (res: any) => {
        this.menus = Array.isArray(res) ? res : res?.data || [];

        // Hierarchical menu
        if (this.menus.length && this.menus[0].subMenu) {
          this.groupedMenus = this.menus.map((m: any) => ({
            idKey: `id-${m.menu_id}`,
            name: m.menu_Name,
            items: m.subMenu
          }));
        }
        // Flat menu
        else {
          const groups: { [key: string]: any[] } = {};

          this.menus.forEach((m: any) => {
            const parent = m.ParantName || 'Menu';
            groups[parent] = groups[parent] || [];
            groups[parent].push(m);
          });

          this.groupedMenus = Object.keys(groups).map(k => ({
            idKey: `name-${k}`,
            name: k,
            items: groups[k]
          }));
        }

        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load menu';
        this.loading = false;
      }
    });
  }

  // 🔥 MAIN ROUTING LOGIC
  onMenuClick(menu: any) {
    const name =
      (menu.menu_Name || menu.Menu_Name || menu.MenuName || menu.Menu || '')
        .toLowerCase();

    if (name.includes('add client')) {
      this.router.navigate(['/record-form']);
    }
    else if (name.includes('view client')) {
      this.router.navigate(['/records']);
    }
    else if (name.includes('view state')) {
    this.router.navigate(['/state-list']);
  }
  else if (name.includes('add state')) {
    this.router.navigate(['/add-state']);
  }
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']).then(() => location.reload());
  }
}
