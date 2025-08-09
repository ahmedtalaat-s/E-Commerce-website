import { Injectable } from '@angular/core';
import { SupabaseclientService } from './supabaseclient.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private _supabaseclient: SupabaseclientService) { }

  async getAllCategories() {
    let { data: categories, error } = await this._supabaseclient.client
  .from('categories')
      .select('*')
    return categories
  }
  async getCategoryById(id:string) {
    let { data: category, error } = await this._supabaseclient.client
  .from('categories')
      .select('*').eq('id',id)
    return category
  }
  async AddCategory(category:string) {
   const { data, error } = await this._supabaseclient.client
  .from('categories')
  .insert(
    { name:category },
    ).select()
    return { data, error}
  }
  async updateCategory(id:string,category:string) {
   const { data, error } = await this._supabaseclient.client
  .from('categories')
  .update(
    { name:category }
  )
  .eq('id',id)
  }

  async deleteCategory(id:string) {
    const { error } = await this._supabaseclient.client
  .from('categories')
  .delete()
  .eq('id', id)
  }



}
