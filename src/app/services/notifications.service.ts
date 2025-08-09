import { Injectable } from '@angular/core';
import { SupabaseclientService } from './supabaseclient.service';
import { RealtimeChannel } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private newNotificationSubject = new Subject<any>();
   private channel: RealtimeChannel | null = null;

  // BehaviorSubject to hold unread count
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private _supabase:SupabaseclientService) { }

   // ✅ Get all notifications for a user
  async getAllNotifications() {
    let userId = localStorage.getItem('zerdyUserId')
    const { data, error } = await this._supabase.client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // ✅ Add a new notification
  async addNotification(notification: {
    user_id: string;
    title: string;
    message: string;
  }) {
    const { data, error } = await this._supabase.client
      .from('notifications')
      .insert([notification]);

    if (error) throw error;
    return data;
  }

  // ✅ Mark a notification as read
  async markAsRead(id: string) {
    const { data, error } = await this._supabase.client
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  // ✅ Delete a notification
  async deleteNotification(id: string) {
    const { error } = await this._supabase.client
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  listenToUserNotifications(userId: string) {
    this.channel = this._supabase.client
      .channel(`user-${userId}-notifications`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newNotification = payload.new;
          this.newNotificationSubject.next(newNotification);

          // Increase unread count by 1
          this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
        }
      )
      .subscribe();
  }

  onNewNotification(): Observable<any> {
      return this.newNotificationSubject.asObservable();
    }

  // Optionally, fetch unread count from DB on init
  async loadInitialUnreadCount(userId: string) {
    const { data, error } = await this._supabase.client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false);
    console.log(data);

    if (!error && data !== null) {
      this.unreadCountSubject.next(data.length || 0);
    }
  }
  // Mark all as read
  async markAllAsRead(userId: string) {
    const { error } = await this._supabase.client
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (!error) {
      this.unreadCountSubject.next(0);
    }
  }

  ngOnDestroy() {
    if (this.channel) {
      this._supabase.client.removeChannel(this.channel);
    }
  }
}
