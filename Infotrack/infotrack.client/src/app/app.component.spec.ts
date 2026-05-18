import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve solicitors from the server', () => {
    const mockSolicitors = [
      { name: 'Solicitor 1', address: '123 Main St', telephone: '1234567890', location: 'London', starRating: 4.5 },
      { name: 'Solicitor 2', address: '456 Main St', telephone: '1234567890', location: 'London', starRating: 4.5 }
    ];

    component.getSolicitors(['London']);

    const req = httpMock.expectOne(
      (request) => request.url === 'https://localhost:7047/solicitors/getSolicitors'
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.getAll('locations')).toEqual(['London']);
    req.flush(mockSolicitors);

    expect(component.solicitors).toEqual(mockSolicitors);
  });
});