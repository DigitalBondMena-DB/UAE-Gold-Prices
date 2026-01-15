import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-success',
  imports: [],
  templateUrl: './contact-success.html',
  styleUrl: './contact-success.css',
})
export class ContactSuccess {
  private router = inject(Router);

  goToHome(): void {
    this.router.navigate(['/']);
  }

  closeAndGoBack(): void {
    this.router.navigate(['/contact-us']);
  }
}
