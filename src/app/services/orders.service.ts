import { Injectable } from '@angular/core';
import { SupabaseclientService } from './supabaseclient.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
    private newOrderSubject = new Subject<any>();
    private channel: any;

  constructor(private _supabase: SupabaseclientService) {
     this.listenToOrderInserts();
  }

  async addOrder(orderData:any) {
    const user = await this._supabase.client.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) throw new Error('User not logged in');

    const { error } = await this._supabase.client.from('orders').insert(orderData);

    if (error) throw error;
  }

  // ✅ Get current user's orders
  async getAllOrders() {

    const { data, error } = await this._supabase.client
      .from('orders')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }
  // ✅ Get current user's orders
  async getMyOrders() {
    const user = await this._supabase.client.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) throw new Error('User not logged in');

    const { data, error } = await this._supabase.client
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  // ✅ Get single order by ID
  async getOrderById(orderId: string) {
    const { data, error } = await this._supabase.client
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  }

  // ✅ (Optional) Delete order
  async deleteOrder(orderId: string) {
    const { error } = await this._supabase.client
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;
  }

  async updateOrderState(orderId: string,newState:string) {
    const { data,error } = await this._supabase.client
    .from('orders')
  .update({ state: newState })
  .eq('id', orderId)
  .select()

    if (error) throw error;
  }


  //subscribe to orders
  private listenToOrderInserts() {
    this.channel = this._supabase.client
      .channel('order-insert-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const newOrder = payload.new;
          this.newOrderSubject.next(newOrder);
        }
      )
      .subscribe();
  }
  onNewOrder(): Observable<any> {
    return this.newOrderSubject.asObservable();
  }

  // ✅ Cleanup when service is destroyed (usually only if manually removed)
  ngOnDestroy(): void {
    if (this.channel) {
      this._supabase.client.removeChannel(this.channel);
    }
  }

  async getOrdersCount(): Promise<number> {
    const { count, error } = await this._supabase.client
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count ?? 0;
  }
}
