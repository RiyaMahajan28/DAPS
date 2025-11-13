import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [ReactiveFormsModule,
            CommonModule,
            FormsModule,
            NgSelectModule,
            
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css',
  encapsulation: ViewEncapsulation.None,
})
// export class LocationComponent implements OnInit {

//   states: any[] = [];
//   cities: any[] = [];
//   locations: any[] = [];

//   selectedStateId: number | null = null;
//   selectedCityId: number | null = null;
//   // Add modal/form state
//   showAddModal: boolean = false;
//   addStateId: number | null = null;
//   addCityId: number | null = null;
//   addLocationName: string = '';
 
//   constructor(private api: ApiService, private router: Router) {}

//   ngOnInit(): void {
//     this.loadStates();
//   }

//   loadStates() {
//     this.api.getStates().subscribe({
//       next: (res) => (this.states = res),
//       error: (err) => console.error('Error loading states:', err)
//     });
//   }

//   onStateChange() {
//     if (this.selectedStateId) {
//       this.api.getCities().subscribe({
//         next: (res) => {
//           // filter only cities that belong to selected state (if backend doesn’t do this)
//           this.cities = res.filter(city => city.state_id == this.selectedStateId);
//         },
//         error: (err) => console.error('Error loading cities:', err)
//       });
//     }
//   }

//   onCityChange() {
//     if (this.selectedCityId) {
//       this.api.getLocationByCity(this.selectedCityId).subscribe({
//         next: (res) => (this.locations = res),
//         error: (err) => console.error('Error loading locations:', err)
//       });
//     }
//   }

//   // Open add modal and preload states/cities
//   openAddModal() {
//     this.showAddModal = true;
//     this.addLocationName = '';
//     this.addStateId = null;
//     this.addCityId = null;
//     // ensure we have the latest states
//     this.loadStates();
//     // preload cities (full list) so we can filter when state selected
//     this.api.getCities().subscribe({
//       next: (res) => (this.cities = res),
//       error: (err) => console.error('Error loading cities for add modal:', err)
//     });
//   }

//   closeAddModal() {
//     this.showAddModal = false;
//   }

//   onAddStateChange() {
//     if (this.addStateId) {
//       // filter cities by selected state
//       this.api.getCities().subscribe({
//         next: (res) => {
//           this.cities = res.filter(city => city.state_id == this.addStateId);
//         },
//         error: (err) => console.error('Error loading cities for add form:', err)
//       });
//     } else {
//       this.cities = [];
//     }
//   }

//   addLocation() {
//     if (!this.addStateId || !this.addCityId || !this.addLocationName.trim()) {
//       alert('Please provide state, city and location name');
//       return;
//     }

//     const payload = {
//       state_id: this.addStateId,
//       city_id: this.addCityId,
//       location_name: this.addLocationName.trim()
//     };

//     this.api.addLocation(payload).subscribe({
//       next: (res) => {
//         // Close modal and refresh locations list
//         this.closeAddModal();
//         // If user added a location for the currently selected city, refresh the list
//         if (this.selectedCityId === this.addCityId) {
//           this.onCityChange();
//         }
//         // navigate to location page (reloads route) to show the updated list
//         this.router.navigateByUrl('/location');
//       },
//       error: (err) => {
//         console.error('Error adding location:', err);
//         alert('Failed to add location');
//       }
//     });
//   }
// }
export class LocationComponent implements OnInit {
  states: any[] = [];
  cities: any[] = [];
  locations: any[] = [];
  filteredLocations: any[] = [];

  selectedStateId: number | null = null;
  selectedCityId: number | null = null;

  // 🔍 Search box
  searchText: string = '';

  // Add modal/form state
  showAddModal: boolean = false;
  addStateId: number | null = null;
  addCityId: number | null = null;
  addLocationName: string = '';
  addPincode: number | null = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadStates();
  }

  loadStates() {
    this.api.getStates().subscribe({
      next: (res) => (this.states = res),
      error: (err) => console.error('Error loading states:', err),
    });
  }

  onStateChange() {
    if (this.selectedStateId) {
      this.api.getCities().subscribe({
        next: (res) => {
          this.cities = res.filter(
            (city) => city.state_id == this.selectedStateId
          );
        },
        error: (err) => console.error('Error loading cities:', err),
      });
    }
  }

  onCityChange() {
    if (this.selectedCityId) {
      this.api.getLocationByCity(this.selectedCityId).subscribe({
        next: (res) => {
          this.locations = res;
          this.filteredLocations = res; // initialize filtered list
        },
        error: (err) => console.error('Error loading locations:', err),
      });
    }
  }

  // 🔍 Client-side filter
 onSearchChange() {
  const search = this.searchText.toLowerCase();
  this.filteredLocations = this.locations.filter((loc) =>
    (loc.location_name?.toLowerCase() || '').includes(search) ||
    loc.pincode?.toString().includes(search) ||
    (loc.city_name?.toLowerCase() || '').includes(search) ||
    (loc.state_name?.toLowerCase() || '').includes(search) ||
    loc.location_Uid?.toString().includes(search) ||
    (loc.added_by?.toLowerCase() || '').includes(search)
  );
}


  openAddModal() {
    this.showAddModal = true;
    this.addLocationName = '';
    this.addStateId = null;
    this.addCityId = null;
    this.loadStates();
    this.api.getCities().subscribe({
      next: (res) => (this.cities = res),
      error: (err) => console.error('Error loading cities for add modal:', err),
    });
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  onAddStateChange() {
    if (this.addStateId) {
      this.api.getCities().subscribe({
        next: (res) => {
          this.cities = res.filter((city) => city.state_id == this.addStateId);
        },
        error: (err) => console.error('Error loading cities for add form:', err),
      });
    } else {
      this.cities = [];
    }
  }

  addLocation() {
    if (!this.addStateId || !this.addCityId || !this.addLocationName.trim()) {
      alert('Please provide state, city and location name');
      return;
    }

    const payload = {
      state_id: this.addStateId,
      city_id: this.addCityId,
      pincode: this.addPincode,
//  added_by:0,
       location_name: this.addLocationName.trim(),
    };

    this.api.addLocation(payload).subscribe({
      next: () => {
        this.closeAddModal();
        if (this.selectedCityId === this.addCityId) {
          this.onCityChange();
        }
        this.router.navigateByUrl('/locations');
      },
      error: (err) => {
        console.error('Error adding location:', err);
        alert('Failed to add location');
      },
    });
  }
}
