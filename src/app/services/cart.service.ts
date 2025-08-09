import { Injectable } from '@angular/core';
import { SupabaseclientService } from './supabaseclient.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private supabase: SupabaseclientService) {}

  async addToCart(cartOrder: any) {
    const { data, error } = await this.supabase.client
      .from('cart')
      .insert([cartOrder]);
    if (error) throw error;
    return data;
  }

  async getCartByUser() {
    let userId=localStorage.getItem('zerdyUserId')
    const { data, error } = await this.supabase.client
      .from('cart')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  }

  async deleteCartItem(cartItemId: string) {
    const { data, error } = await this.supabase.client
      .from('cart')
      .delete()
      .eq('id', cartItemId);
    if (error) throw error;
    return data;
  }

  async clearCartForUser() {
  const userId = localStorage.getItem('zerdyUserId')

  if (!userId) throw new Error('User not logged in');

  const { error } = await this.supabase.client
    .from('cart')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}
}
