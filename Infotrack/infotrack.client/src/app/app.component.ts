import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  public solicitors: Solicitor[] = [];
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

  onSearch() {
    const locations = this.searchForm.get('locations')?.value; // string[]
    this.getSolicitors(locations);
  }

  getSolicitors(locations: string[]) {
    let params = new HttpParams();
    for (const location of locations) {
      params = params.append('locations', location);
    }
    this.http.get<Solicitor[]>('https://localhost:7047/solicitors/getSolicitors', { params: params }).subscribe(
      (result) => {
        this.solicitors = result;
        console.log(this.solicitors);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  title = 'infotrack.client';
}
