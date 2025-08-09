import { Injectable } from '@angular/core';
import { SupabaseclientService } from './supabaseclient.service';
import { environment } from '../../environments/environment';
import { id } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _supabaseclient: SupabaseclientService) { }

  //  Sign up a user
  async signUp(username:string,email: string, password: string) {
    let data = await this._supabaseclient.client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:`${environment.baseUrl}sign`,
        data: {
          username,
          role:'customer'
        }
      }
    });
    await this._supabaseclient.client.from('profiles').insert([{ id: data.data.user?.id, full_name: username, email }])
    return data
  }

  //  Log in a user
  async signIn(email: string, password: string) {
    return this._supabaseclient.client.auth.signInWithPassword({ email, password });
  }

  //  Get current user
  async getUser() {
    const { data } = await this._supabaseclient.client.auth.getUser();
    return data.user;
  }
  // sign out from supabase
  async signOut() {
    localStorage.clear()
    return this._supabaseclient.client.auth.signOut();
  }
  //reset password
  async resetPassword(email: string) {
    return this._supabaseclient.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${environment.baseUrl}updatepassword`
    });
  }
  //update password
  async updatePassword(newPassword: string) {
    return this._supabaseclient.client.auth.updateUser({ password: newPassword });
  }
  //update address and phone
  async updateMetadata(phone: string, address: string) {
  return this._supabaseclient.client.auth.updateUser({
    data: {
      phone,
      address
    }
  });
  }

  // get user name

  async getUserName(userId: string) {
     const { data, error } = await this._supabaseclient.client.
    from('profiles').select('full_name').eq('id',userId);

    if (error) throw error;

    return data[0].full_name  ;
  }
  async getUserEmail(userId: string) {
    const { data, error } = await this._supabaseclient.client.
    from('profiles').select('email').eq('id',userId);

    if (error) throw error;

    return data[0].email  ;
  }

   async getUsersCount(): Promise<number> {
    const { count, error } = await this._supabaseclient.client
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count ?? 0;
  }
}
