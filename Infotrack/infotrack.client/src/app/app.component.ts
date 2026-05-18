import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

interface Solicitor {
  name: string;
  address: string;
  telephone: string;
  location: string;
  starRating: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @ViewChild('locationDropdown') locationDropdown?: ElementRef<HTMLElement>;

  public solicitors: Solicitor[] = [];
  public isLoading = false;
  public hasSearched = false;
  public locationDropdownOpen = false;
  public searchForm: FormGroup = this.formBuilder.group({
    locations: this.formBuilder.control<string[]>([]),
  });

  public locationList: string[] = [
    'Birmingham',
    'Bradford',
    'Bristol',
    'Leeds',
    'Liverpool',
    'London',
    'Manchester',
    'Sheffield',
  ];

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {}

  ngOnInit() {
    //this.getSolicitors();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.locationDropdownOpen) {
      return;
    }
    const dropdownEl = this.locationDropdown?.nativeElement;
    if (dropdownEl && event.target instanceof Node && dropdownEl.contains(event.target)) {
      return;
    }
    this.locationDropdownOpen = false;
  }

  toggleLocationDropdown(event: Event): void {
    event.stopPropagation();
    this.locationDropdownOpen = !this.locationDropdownOpen;
  }

  onSearch() {
    const locations: string[] = this.searchForm.get('locations')?.value ?? [];
    if (locations.length === 0) {
      return;
    }
    this.locationDropdownOpen = false;
    this.getSolicitors(locations);
  }

  getSolicitors(locations: string[]) {
    let params = new HttpParams();
    for (const location of locations) {
      params = params.append('locations', location);
    }

    this.isLoading = true;
    this.hasSearched = false;

    this.http.get<Solicitor[]>('https://localhost:7047/solicitors/getSolicitors', { params }).subscribe({
      next: (result) => {
        this.solicitors = result;
        this.hasSearched = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.solicitors = [];
        this.hasSearched = true;
        this.isLoading = false;
      },
    });
  }

  get displayedSolicitors(): Solicitor[] {
    return this.solicitors;
  }

  get locationSelectionLabel(): string {
    const selected: string[] = this.searchForm.get('locations')?.value ?? [];
    if (selected.length === 0) {
      return 'Select locations';
    }
    if (selected.length === 1) {
      return selected[0];
    }
    return `${selected.length} locations selected`;
  }

  isLocationSelected(location: string): boolean {
    return (this.searchForm.get('locations')?.value ?? []).includes(location);
  }

  toggleLocation(location: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current: string[] = [...(this.searchForm.get('locations')?.value ?? [])];
    if (checked) {
      if (!current.includes(location)) {
        current.push(location);
      }
    } else {
      const index = current.indexOf(location);
      if (index >= 0) {
        current.splice(index, 1);
      }
    }
    this.searchForm.patchValue({ locations: current });
  }

  formatTelephone(telephone: string): string {
    const digits = telephone.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('0')) {
      return `${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    }
    return telephone;
  }

  title = 'infotrack.client';
}
