import { Routes } from '@angular/router';
import { authGuard } from './_guards/auth-guard';

export const routes: Routes = [
    // Redirect root to login
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    
    // Login route
    { 
        path: 'login', 
        loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
    },

    // Admin Dashboard route
    {
        path: 'admin/dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard').then(m => m.DashboardComponent),
        canActivate: [authGuard], // Apply the guard here
        data: { roles: ['Admin'] } // Specify that only 'Admin' role can access
    },
    {
        path: 'teacher/dashboard',
        loadComponent: () => import('./teacher/dashboard/dashboard').then(m => m.DashboardComponent),
        canActivate: [authGuard],
        data: { roles: ['Teacher'] } // Only Teacher can access
    },
        // ---> ADD THE STUDENT DASHBOARD ROUTE <---
        {
            path: 'student/dashboard',
            loadComponent: () => import('./student/dashboard/dashboard').then(m => m.DashboardComponent),
            canActivate: [authGuard],
            data: { roles: ['Student'] } // Only Student can access
        },
    
    // Add a catch-all route for any other path
    { path: '**', redirectTo: 'login' }
];