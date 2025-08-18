import { Component } from '@angular/core';
import { product } from '../../Admin/admin-dashboard/children/products/interface';
import { category } from '../../Admin/admin-dashboard/children/interface';
import { CategoriesService } from '../../../services/categories.service';
import { ProductServicesService } from '../../../services/product-services.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.css'
})
export class AllProductsComponent {
  activeCategory!:string;
  activeSize!:string;
  products: product[] = []
  categories: category[] = []
  currentPage:number = 1
  itemsPerPage: number = 9
  totalPages: number = 0
  totalItems:number=0
  filters = {
  categoryId: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  size: undefined,
  color: undefined
  };
  sizes=['XS', 'S', 'M', 'L', 'XL','XXL']

  constructor(private _categoryServices: CategoriesService, private _productServices: ProductServicesService,private _router:Router) {
    this.getAllCategories()
    this.getAllproducts()
  }

  async ngOnInit() {
      window.scrollTo({top:0})
    await this.loadPage(this.currentPage);
  }



  async getAllCategories() {
    this.categories = await this._categoryServices.getAllCategories() as []
  }
  async getAllproducts() {
    this.products = await this._productServices.getProducts(this.currentPage,this.itemsPerPage,this.filters) as []
  }

  async loadPage(page: number) {
    this.totalItems = await this._productServices.getProductCount(this.filters);
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = page;
    this.products = await this._productServices.getProducts(page, this.itemsPerPage,this.filters) as [];
  }
  categoryClicked(id:any) {
this.currentPage=1
    this.activeCategory = id
    this.filters.categoryId = id
    this.loadPage(1)
  }

  onMinPriceChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const min = parseFloat(target.value);
  this.filters.minPrice  = isNaN(min) ? undefined : min as any;
  this.loadPage(1);
}

onMaxPriceChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const max = parseFloat(target.value);
  this.filters.maxPrice = isNaN(max) ? null : max as any;
  this.loadPage(1);
}

  async onSizeChange(size: any) {
  this.activeSize=size
  this.filters.size = size ;
  this.loadPage(1);
  }

  navigateToProduct(id:any) {
    this._router.navigate(['product',id])
  }
}
