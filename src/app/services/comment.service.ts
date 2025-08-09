import { Injectable } from '@angular/core';
import { SupabaseclientService } from './supabaseclient.service';
import { review } from '../modules/customer/product/interface';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private _supabaseclient: SupabaseclientService) { }

  async addComment(review:review) {
    const { data, error } = await this._supabaseclient.client
      .from('product_reviews')
      .insert([review]);

    if (error) throw error;
    return data;
  }

  /** Get all comments for a product */
  async getComments(productId: string) {
    const { data, error } = await this._supabaseclient.client
      .from('product_reviews')
      .select(`
        id,
        comment,
        rating,
        created_at,
        user_id,
        profiles(full_name)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /** Update a comment */
  async updateComment(commentId: string, newComment: string, newRating: number) {
    const { data, error } = await this._supabaseclient.client
      .from('product_reviews')
      .update({ comment: newComment, rating: newRating })
      .eq('id', commentId);

    if (error) throw error;
    return data;
  }

  /** Delete a comment */
  async deleteComment(commentId: string) {
    const { data, error } = await this._supabaseclient.client
      .from('product_reviews')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    return data;
  }

  /** Get review count for a product */
  async getReviewCount(productId: string) {
    const { count, error } = await this._supabaseclient.client
      .from('product_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', productId);

    if (error) throw error;
    return count ?? 0;
  }

  /** Get total rating (sum of ratings) for a product */
  async getTotalRating(productId: string) {
    const { data, error } = await this._supabaseclient.client
      .from('product_reviews')
      .select('rating')
      .eq('product_id', productId);

    if (error) throw error;

    return data?.reduce((sum, review) => sum + review.rating, 0) ?? 0;
  }

  /** Get average rating for a product */
  async getAverageRating(productId: string) {
    const totalRating = await this.getTotalRating(productId);
    const reviewCount = await this.getReviewCount(productId);
    return reviewCount > 0 ? totalRating / reviewCount : 0;
  }
}
