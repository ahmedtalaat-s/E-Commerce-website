import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductServicesService } from '../../../services/product-services.service';
import { product } from '../../Admin/admin-dashboard/children/products/interface';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from "./children/canvas/canvas.component";
import { CartService } from '../../../services/cart.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../../services/comment.service';
import { review } from './interface';
import { formatDistanceToNow } from 'date-fns'
import { AuthService } from '../../../services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, CanvasComponent,ReactiveFormsModule,RouterModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @ViewChild(CanvasComponent) canvasComponent!:CanvasComponent
  productId!: string;
  product!: product
  loading: boolean = true
  currentColor: any='black'
  currentSize: any='M'
  quantity: number = 1
  designUrl: string = ''
  rowDesignUrl: string = ''
  designSuccess: boolean = false
  message!:string
  addedToCartBool: boolean = false
  addTocartBtnBool: boolean = false
  totalPrice: number = 0
  title!: string
  currentUserId=localStorage.getItem("zerdyUserId")
  role:boolean=localStorage.getItem("zerdyUserRole")=='zerdyAdmin'

  // comments
   stars = [1, 2, 3, 4, 5];
  selectedRating = 0; // Final rating
  hoveredRating = 0;  // Temporary hover state
  reviewForm!: FormGroup;
  reviews!: review[];
  reviewCount!: number;
  averageRating!: number;
  fullStars: number[] = [];
halfStar = false;
  emptyStars: number[] = [];
  recommended:product[]=[]

  constructor(private _activatedRouter: ActivatedRoute, private _productServices: ProductServicesService,
    private _cartServices:CartService,private fb: FormBuilder,private commentService:CommentService,private userServices:AuthService,private _router:Router
  ) {

this.productId = this._activatedRouter.snapshot.paramMap.get('id') as string


  }
  ngOnInit(): void{
    this.getProduct()
    this.reviewForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.loadReviews(this.productId)

  }
  async getProduct() {
    this._productServices.getproductById(this.productId).then(data => {
      this.product = data?.[0]
      this.loading = false
      window.scrollTo({top:0})
      })

    this.recommended =await this._productServices.getRandomProducts()

  }

  changeQuantity(number:number) {
    this.quantity += number
    if (this.quantity == 0) {
      this.quantity=1
    }
    if (this.quantity > 100) {
      this.quantity=100
    }
  }

  colorChanged(color: any) {
    this.currentColor=color
  }
  sizeChanged(size: any) {
    this.currentSize=size
  }
  save() {
    this.addTocartBtnBool=true
    this.canvasComponent.saveCanvas().then((urls:any) => {
      this.designUrl = urls?.url ? urls?.url  : ''
      this.rowDesignUrl = urls?.url2 ? urls?.url2  : ''
      this.designSuccess = true
    this.addTocartBtnBool=false

  });

  }

  changeMessage(e:any) {
    this.message=e.target.value
  }

  addToCart() {
    if (localStorage.getItem('zerdyUserId')) {
      this.totalPrice=this.product.price*this.quantity
    let cartOrder = {
      user_id:localStorage.getItem('zerdyUserId'),
    color:this.currentColor,
  size: this.currentSize,
  quantity: this.quantity,
  design: this.designUrl,
      row_design: this.rowDesignUrl,
      product_id: this.productId,
      base_product_img: this.product.image_url,
      additional_comment: this.message,
   totalPrice:  this.totalPrice,
  title:this.product.name
    }


    this._cartServices.addToCart(cartOrder).then(() => {
      this.addedToCartBool=true
    })
    }
    else {
      this._router.navigate(['/sign'])
    }

  }
   selectRating(rating: number) {
    this.selectedRating = rating;
  }

  hoverRating(rating: number) {
    this.hoveredRating = rating;
  }

  resetHover() {
    this.hoveredRating = 0;
  }

  isStarActive(star: number): boolean {
    return star <= (this.hoveredRating || this.selectedRating);
  }
  addComment() {
    let userId=localStorage.getItem('zerdyUserId') as string
    let review: review = {
      user_id: userId,
      comment: this.reviewForm.value.comment,
      rating: this.hoveredRating,
      product_id:this.productId
    }
    console.log(review);
    this.commentService.addComment(review).then(() => {
      const submitBtn = document.querySelector(".comment-submit") as HTMLButtonElement;
        submitBtn.innerHTML = "✓ Comment Posted";
        submitBtn.style.background =
          "linear-gradient(135deg, #16a34a, #22c55e)";
        setTimeout(() => {
          submitBtn.innerHTML = "Post Comment";
          submitBtn.style.background =
            "linear-gradient(135deg, #8b5cf6, #a855f7)";
        }, 1500);
      this.loadReviews(this.productId);
    })
    this.reviewForm.reset()
    this.hoveredRating = 0
    this.selectedRating = 0
  }

  async loadReviews(productId: string) {
  this.reviews = await this.commentService.getComments(productId);
  this.reviewCount = await this.commentService.getReviewCount(productId);
    this.averageRating = await this.commentService.getAverageRating(productId);
console.log(this.reviews);

     const full = Math.floor(this.averageRating==0?5:this.averageRating);
  const half = this.averageRating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  this.fullStars = Array(full).fill(0);
  this.halfStar = half;
    this.emptyStars = Array(empty).fill(0);


  }
  getStarsArray(rating: number) {
    return Array(rating).fill(0); // for ngFor
  }

  getTimeAgo(date:any) {
    return formatDistanceToNow(date,{addSuffix:true})
  }
  async getUserName(userId:any) {
    return await this.userServices.getUserName(userId)
  }

  deleteComment(id:any) {
    console.log(id);
    this.commentService.deleteComment(id).then(() => {
      this.loadReviews(this.productId)
    })
  }

  // navigate to product
  navigateToProduct(id: any) {
    this.productId = id
    this.ngOnInit()
    this._router.navigate([`/product`,id]);

  }
  checkUserLogin() {
    console.log('logged');

    if (localStorage.getItem('zerdyUserId') == null) {
      const canvas = document.getElementById('canvas')
      const modalInstance=bootstrap.Modal.getInstance(canvas);
       setTimeout(() => {
         modalInstance.hide();
  },500);

    }
  }
}
