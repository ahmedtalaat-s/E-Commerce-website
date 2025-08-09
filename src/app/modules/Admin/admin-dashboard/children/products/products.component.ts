import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductServicesService } from '../../../../../services/product-services.service';
import { product } from './interface';
import { category } from '../interface';
import { CategoriesService } from '../../../../../services/categories.service';
import { CommonModule } from '@angular/common';
import { NgxImageCompressService } from 'ngx-image-compress';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
 productForm!: FormGroup;
  errormessage: string = ''
  products: product[] = []
  categories:category[]=[]
  updateId!: string
  updateBool: boolean = false
  selectedImage: string = '';
  imageFile: File | null = null;
  imageUrl: string = '';
   filters = {
  categoryId: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  size: undefined,
  color: undefined
};



  constructor(private _fb: FormBuilder,private _productServices:ProductServicesService, private _categoryServices:CategoriesService,private _Imagecompress:NgxImageCompressService) {
    this.createform()
    this.getAllCategories()
    this.getAllproducts()

  }

  createform() {

    this.productForm = this._fb.group({
      Name:new FormControl('',[Validators.required,Validators.minLength(3)]),
      description:new FormControl('',[Validators.required]),
      price:new FormControl('',[Validators.required]),
      image: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      colors: new FormControl('', [Validators.required]),
      sizes: new FormControl('', [Validators.required]),
      stock: new FormControl('', [Validators.required]),

    })
  }

  trim(arr: string[]): string[] {
  return arr.map(el => el.trim());
}


  addProduct() {
    let colors = this.productForm.get('colors')?.value.split(',')
    let sizes = this.productForm.get('sizes')?.value.split(',')
    colors=this.trim(colors)
    sizes = this.trim(sizes)
    this._productServices.uploadToSupabase(this.imageFile).then((url) => {
      this.imageUrl=url as string
    }).then(() => {
      let product: product = {
      name: this.productForm.get('Name')?.value,
      category_id: this.productForm.get('category')?.value,
      description: this.productForm.get('description')?.value,
      price: this.productForm.get('price')?.value,
      image_url: this.imageUrl,
      colors,
      sizes,
      stock_quantity:this.productForm.get('stock')?.value
    }

    this._productServices.Addproduct(product).then(({ data, error }) => {
      if (data) {
        this.productForm.reset()
        document.getElementById('product-success')?.classList.add('show')
      setTimeout(() => {
         document.getElementById('product-success')?.classList.remove('show')
      }, 3000)
        this.getAllproducts()
      }
      if (error) {
        console.log(error);

        document.getElementById('product-error')?.classList.add('show')
      setTimeout(() => {
         document.getElementById('product-error')?.classList.remove('show')
      },3000)
      }
    })
    })




  }

  async getAllproducts() {
    this.products = await this._productServices.getProducts(1,500000,this.filters) as []
    console.log(this.products);

  }

  deleteProduct(id: any, imagePath: string) {
    this._productServices.deleteImage(imagePath).then(() => {
      this._productServices.deleteproduct(id).then(
      () => {
        this.getAllproducts()
      }
    )
    })

  }

  updateProduct(id:any) {
    this.updateId = id
    this.updateBool = true
    this.imageFile=null
    this._productServices.getproductById(id).then((product) => {
      let productInfo: product = product?.[0]
      this.imageUrl=productInfo.image_url
      this.productForm.setValue({
        Name: productInfo.name,
        category: productInfo.category_id,
        price: productInfo.price,
        stock: productInfo.stock_quantity,
        description: productInfo.description,
        colors:productInfo.colors,
        sizes: productInfo.sizes,
        image: ''
      })

    })
  }
  checkImageUpdated() {
    if (this.imageFile) {
      return true
    } else {
      return false
    }
  }
  updateProductInDatabase() {
    if (this.checkImageUpdated()) {
      this._productServices.uploadToSupabase(this.imageFile).then((url) => {
      this.imageUrl=url as string
    }).then(() => {
      //
    let colors = this.productForm.get('colors')?.value.split(',')
    let sizes = this.productForm.get('sizes')?.value.split(',')
    colors=this.trim(colors)
    sizes = this.trim(sizes)
    let product: product = {
      name: this.productForm.get('Name')?.value,
      category_id: this.productForm.get('category')?.value,
      description: this.productForm.get('description')?.value,
      price: this.productForm.get('price')?.value,
      image_url: this.imageUrl,
      colors,
      sizes,
      stock_quantity: this.productForm.get('stock')?.value
      }
      this._productServices.updateproduct(this.updateId, product).then(
      () => {
        this.getAllproducts()
        this.productForm.reset()
        this.updateBool=false
      }
    )
    })
    } else {

      //
    let colors = this.productForm.get('colors')?.value.split(',')
    let sizes = this.productForm.get('sizes')?.value.split(',')
    colors=this.trim(colors)
    sizes = this.trim(sizes)
    let product: product = {
      name: this.productForm.get('Name')?.value,
      category_id: this.productForm.get('category')?.value,
      description: this.productForm.get('description')?.value,
      price: this.productForm.get('price')?.value,
      image_url: this.imageUrl,
      colors,
      sizes,
      stock_quantity: this.productForm.get('stock')?.value
      }
      this._productServices.updateproduct(this.updateId, product).then(
      () => {
        this.getAllproducts()
        this.productForm.reset()
        this.updateBool=false
      }
    )

    }


  }

  async getAllCategories() {
    this.categories = await this._categoryServices.getAllCategories() as []
  }

  onFileChange(event: any) {
    let file = event.target.files[0]
    this.imageFile=file
    console.log(file);


    if (this.imageFile?.size as number>100000) {

      const reader = new FileReader();
      reader.onload = (event: any) => {

        const imageBase64 = event.target.result

        this._Imagecompress.compressFile(imageBase64, -1, 50, 30).then(compressed => {
          this.selectedImage = compressed;
        this.imageFile = this.base64ToFile(compressed, file.name);
        })

      }
      reader.readAsDataURL(file);
    }
  }
  base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const match = arr[0].match(/:(.*?);/);
  const mime = match?.[1] || 'image/png'; // ✅ default to 'image/png' if not found

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
  }

  getCategory(category_id:string) {
    const category = this.categories.find(el => el.id === category_id);
  return category ? category.name : 'Not found';
  }
}
