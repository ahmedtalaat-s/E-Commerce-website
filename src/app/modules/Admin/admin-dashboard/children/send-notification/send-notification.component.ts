import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationsService } from '../../../../../services/notifications.service';
import { ActivatedRoute } from '@angular/router';
import { notification } from './interface';

@Component({
  selector: 'app-send-notification',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './send-notification.component.html',
  styleUrl: './send-notification.component.css'
})
export class SendNotificationComponent {
notificationForm!: FormGroup;
  user_id!: string;
  constructor(private fb: FormBuilder,private _sendnotificationServices:NotificationsService,private _activeRouter:ActivatedRoute) {}

  ngOnInit(): void {
    this.notificationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      message: ['', [Validators.required, Validators.minLength(4)]],
    });
    this.user_id = this._activeRouter.snapshot.paramMap.get('userId') as string;
  }

  sendNotification(e: any) {
    const target = e.currentTarget as HTMLElement;
  const btn = target.lastElementChild as HTMLButtonElement;

    const originalText = btn.innerHTML;
                    btn.innerHTML = '<div class="loading"></div> Processing...';
                    btn.disabled = true;

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }, 1500);

    if (this.notificationForm.valid) {

      let notification: notification = {
        user_id: this.user_id,
        title: this.notificationForm.get('title')?.value,
        message: this.notificationForm.get('message')?.value,
        read:false
      }
      this._sendnotificationServices.addNotification(notification).then(() => {
        // Show success message
            const successMsg = document.getElementById('notification-success');
            successMsg?.classList.add('show');
        setTimeout(() => successMsg?.classList.remove('show'), 3000);
        this.notificationForm.reset();
      })
    } else {
      this.notificationForm.markAllAsTouched(); // show validation errors
    }
  }

  // Helper to access form controls easily in template
  get f() {
    return this.notificationForm.controls;
  }
}
