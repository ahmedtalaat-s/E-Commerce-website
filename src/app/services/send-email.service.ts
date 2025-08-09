import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/supaenvironment';

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {

 constructor(private http: HttpClient) {}

  sendReviewEmail(email: string, productName: string, productId: number) {
    this.http.post(
      'https://kyelptznvpcjnvkwdvve.supabase.co/functions/v1/send-review-email',
      { email, productName, productId },{ headers: { apikey: environment.supabaseKey,'Authorization': `Bearer ${environment.supabaseKey}` } }
    ).subscribe({
      next: res => {alert('Email sent successfully!'),console.log(res);
      },
      error: err => alert('Error sending email: ' + err.message)
    });
  }
}
