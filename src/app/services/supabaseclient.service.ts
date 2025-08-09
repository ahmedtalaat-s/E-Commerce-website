import { Injectable } from '@angular/core';
import { environment } from '../../environments/supaenvironment'
import{createClient, SupabaseClient}from'@supabase/supabase-js'

@Injectable({
  providedIn: 'root'
})
export class SupabaseclientService {
  private supabase:SupabaseClient
  constructor() {
    this.supabase=createClient(environment.supabaseUrl,environment.supabaseKey)
  }
  get client() {
    return this.supabase
  }
}
