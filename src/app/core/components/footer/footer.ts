import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { API_END_POINTS } from '../../constant/ApiEndPoints';
import { ContactInfo } from '../../models/contact.model';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  private readonly apiService = inject(ApiService);
  
  // Contact info signal
  contactInfo = signal<ContactInfo | null>(null);

  ngOnInit(): void {
    this.fetchContactInfo();
  }

  private fetchContactInfo(): void {
    this.apiService.get<ContactInfo>(API_END_POINTS.CONTACT_INFO).subscribe({
      next: (response) => {
        if (response) {
          this.contactInfo.set(response);
        }
      }
    });
  }
}
