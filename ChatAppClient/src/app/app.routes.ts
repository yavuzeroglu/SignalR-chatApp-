import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { inject } from '@angular/core';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        path:"",
        canActivate: [authGuard],
        component: HomeComponent,
    }, 
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "register",
        component: RegisterComponent
    }
];
