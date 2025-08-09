import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../../../../services/categories.service';
import { category } from '../interface';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  categoryForm!: FormGroup;
  errormessage: string = ''
  categories: category[] = []
  updateId!: string
  updateBool:boolean=false


  constructor(private _fb: FormBuilder,private _categoryServices:CategoriesService) {
    this.createform()
    this.getAllCategories()
  }

  createform() {

    this.categoryForm = this._fb.group({
      Name:new FormControl('',[Validators.required,Validators.minLength(3)])
    })
  }

  addCategory() {
    let Name = this.categoryForm.get('Name')?.value;
    this._categoryServices.AddCategory(Name).then(({ data, error }) => {

      if (data) {
        this.categoryForm.reset()
        document.getElementById('category-success')?.classList.add('show')
      setTimeout(() => {
         document.getElementById('category-success')?.classList.remove('show')
      }, 3000)
        this.getAllCategories()
      }
      else {
          this.errormessage="category Name already exists"
         document.getElementById('category-error')?.classList.add('show')
      setTimeout(() => {
         document.getElementById('category-error')?.classList.remove('show')
      },3000)
      }

    })

  }

  async getAllCategories() {
    this.categories = await this._categoryServices.getAllCategories() as []
  }

  deleteCategory(id:string) {
    this._categoryServices.deleteCategory(id).then(
      () => {
        this.getAllCategories()
      }
    )
  }

  updateCategory(id:string) {
    this.updateId = id
    this.updateBool = true
    this._categoryServices.getCategoryById(id).then((cat) => {
      let name = cat?.[0].name
      this.categoryForm.setValue({Name:name})
    })
  }
  updateCategoryInDatabase() {
    let Name = this.categoryForm.get('Name')?.value;
    this._categoryServices.updateCategory(this.updateId, Name).then(
      () => {
        this.getAllCategories()
        this.categoryForm.reset()
        this.updateBool=false
      }
    )
  }
}
