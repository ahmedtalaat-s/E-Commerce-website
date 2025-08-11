import { Routes } from '@angular/router';
import { NoLayoutComponent } from './modules/layouts/no-layout/no-layout.component';
import { MainLayoutComponent } from './modules/layouts/main-layout/main-layout.component';
import { MainpageComponent } from './modules/customer/mainpage/mainpage.component';
import { AllProductsComponent } from './modules/customer/all-products/all-products.component';
import { AuthComponent } from './modules/auth/auth/auth.component';
import { EmailformPageComponent } from './modules/auth/forgotpass/emailform-page/emailform-page.component';
import { ResetpassPageComponent } from './modules/auth/forgotpass/resetpass-page/resetpass-page.component';
import { DashboardComponent } from './modules/customer/dashboard/dashboard.component';
import { authGuard } from './Guards/auth.guard';
import { AdminDashboardComponent } from './modules/Admin/admin-dashboard/admin-dashboard.component';
import{DashboardComponent as dashComponent}from './modules/Admin/admin-dashboard/children/dashboard/dashboard.component'
import { CategoriesComponent } from './modules/Admin/admin-dashboard/children/categories/categories.component';
import { SendNotificationComponent } from './modules/Admin/admin-dashboard/children/send-notification/send-notification.component';
import { OrdersComponent } from './modules/Admin/admin-dashboard/children/orders/orders.component';
import { ProductsComponent as AddProductComponent } from './modules/Admin/admin-dashboard/children/products/products.component';
import { ProductComponent } from './modules/customer/product/product.component';
import { CartComponent } from './modules/customer/cart/cart.component';
import { SuccessComponent } from './modules/customer/stripe-payment/success/success.component';
import { CancelComponent } from './modules/customer/stripe-payment/cancel/cancel.component';
import { paymentGuard } from './Guards/payment.guard';
export const routes: Routes = [
  {path: '', component: MainLayoutComponent, children: [
    { path: '', redirectTo: 'main' ,pathMatch:'full'},
    {path:'main',component:MainpageComponent,pathMatch:'full',title:'Main'},
    {path:'allproducts',component:AllProductsComponent,pathMatch:'full',title:'All Products'},
    {path:'product/:id',component:ProductComponent,pathMatch:'full',title:'Product'},
  ]
  },
  {path: '', component: NoLayoutComponent, children: [
    { path: '', redirectTo: 'main' ,pathMatch:'full'},
    {path:'sign',component:AuthComponent,pathMatch:'full',title:'Sign'},
    {path:'email',component:EmailformPageComponent,pathMatch:'full',title:'Update password'},
    { path: 'updatepassword', component: ResetpassPageComponent, pathMatch: 'full', title: 'Update password' },
    { path: 'cart', component: CartComponent, pathMatch: 'full', title: 'Your Cart',canActivate:[authGuard] },
    { path: 'success', component: SuccessComponent, pathMatch: 'full', title: 'Payment Succeeded' ,canActivate:[paymentGuard]},
    { path: 'cancel', component: CancelComponent, pathMatch: 'full', title: 'Payment Failed' ,canActivate:[paymentGuard]},
    {path:'dashboard',component:DashboardComponent,pathMatch:'full',title:'Dashboard',canActivate:[authGuard]},
    {
      path: 'admindashboard', component: AdminDashboardComponent, title: 'Dashboard', canActivate: [authGuard], children: [
      {path:'',redirectTo:'dashboard',pathMatch:'full'},
      {path:'dashboard',component:dashComponent,pathMatch:'full'},
      {path:'categories',component:CategoriesComponent,pathMatch:'full'},
      {path:'notification/:userId',component:SendNotificationComponent,pathMatch:'full'},
      {path:'orders',component:OrdersComponent,pathMatch:'full'},
      {path:'addProduct',component:AddProductComponent,pathMatch:'full'},
    ]},

  ]
  },

];
