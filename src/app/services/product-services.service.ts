import { Injectable } from '@angular/core';
import { SupabaseclientService } from './supabaseclient.service';

@Injectable({
  providedIn: 'root'
})
export class ProductServicesService {

  constructor(private _supabaseclient: SupabaseclientService) { }

  async getProducts(
  page: number,
  pageSize: number,
  filters: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
  }
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = this._supabaseclient.client
    .from('products')
    .select('*')
    .range(from, to);

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters.minPrice ) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice ) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters.size) {
    query = query.contains('sizes', [filters.size]);
  }
  if (filters.color) {
    query = query.contains('colors', [filters.color]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async getProductCount(filters: {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
}) {
  let query = this._supabaseclient.client
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters.size) {
    query = query.contains('sizes', [filters.size]);
  }
  if (filters.color) {
    query = query.contains('colors', [filters.color]);
  }

  const { count, error } = await query;
  if (error) throw error;
  return count || 0;
}

    async getproductById(id:string) {
      let { data: product, error } = await this._supabaseclient.client
    .from('products')
        .select('*').eq('id',id)
      return product
    }
    async Addproduct(product:object) {
     const { data, error } = await this._supabaseclient.client
    .from('products')
    .insert(
      product
      ).select()
      return { data, error}
    }
    async updateproduct(id:string,product:object) {
     const { data, error } = await this._supabaseclient.client
    .from('products')
    .update(
      product
    )
    .eq('id',id)
    }

    async deleteproduct(id:string) {
      const { error } = await this._supabaseclient.client
    .from('products')
    .delete()
    .eq('id', id)
  }




  //upload image to storage for products
  async uploadToSupabase(image:any) {

    const filePath = `productsImg/${Date.now()}_${image.name}`;

    const { data, error } = await this._supabaseclient.client.storage
      .from('products')
      .upload(filePath, image);

    if (error) {
      console.error('Upload error:', error.message);
      return;
    }

    // Get public URL

    const { publicUrl } = await this._supabaseclient.client.storage
      .from('products')
      .getPublicUrl(filePath).data;


   return publicUrl
  }

  async deleteImage(publicUrl: string) {
    // Extract file path relative to the bucket
const filePath = publicUrl.split('/products/')[1]; // 'uploads/image1.png'

// Delete the file
const { data, error } = await this._supabaseclient.client.storage
  .from('products') // Your bucket name
  .remove([filePath]);

if (error) {
  console.error('Delete failed:', error.message);
} else {
  console.log('Image deleted successfully');
}

  }


  // upload image for designs
  //upload image to storage for products
  async uploadImageToDesigns(image:any) {

    const filePath = `${Date.now()}_${image.name}`;

    const { data, error } = await this._supabaseclient.client.storage
      .from('designs')
      .upload(filePath, image,{contentType:'image/png'});

    if (error) {
      console.error('Upload error:', error.message);
      return;
    }

    // Get public URL

    const { publicUrl } = await this._supabaseclient.client.storage
      .from('designs')
      .getPublicUrl(filePath).data;


   return publicUrl
  }

  async deleteImageFromDesigns(publicUrl: string) {
    // Extract file path relative to the bucket
const filePath = publicUrl.split('/products/')[1]; // 'uploads/image1.png'

// Delete the file
const { data, error } = await this._supabaseclient.client.storage
  .from('designs') // Your bucket name
  .remove([filePath]);

if (error) {
  console.error('Delete failed:', error.message);
} else {
  console.log('Image deleted successfully');
}

  }


  // upload row design
   //upload image to storage for products
  async uploadRowDesignToSupabase(image:any) {

    const filePath = `${Date.now()}_${image.name}`;

    const { data, error } = await this._supabaseclient.client.storage
      .from('row-designs')
      .upload(filePath, image);

    if (error) {
      console.error('Upload error:', error.message);
      return;
    }

    // Get public URL

    const { publicUrl } = await this._supabaseclient.client.storage
      .from('row-designs')
      .getPublicUrl(filePath).data;


   return publicUrl
  }

  //get
   // Get 4 random products
  async getRandomProducts(limit: number = 4) {
    // First get total product count
    const { count, error: countError } = await this._supabaseclient.client
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // Generate random offset
    const offset = Math.floor(Math.random() * Math.max(0, (count ?? 0) - limit));

    // Fetch products starting from random offset
    const { data, error } = await this._supabaseclient.client
      .from('products')
      .select('*')
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data;
  }

 // Count all products
  async getProductsCount(): Promise<number> {
    const { count, error } = await this._supabaseclient.client
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count ?? 0;
  }
}
