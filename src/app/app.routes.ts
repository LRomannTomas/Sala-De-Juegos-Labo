import { Routes } from '@angular/router';
import { Home } from './pages/home/home';


export const routes: Routes = [{
    path: "home", component: Home,
    title: "Sala de Juegos"
}, {
    path: "registro", loadComponent: () => import("./pages/registro/registro").then((archivo) => archivo.Registro),

    title: "Registro"
}, {
    path: "login", loadComponent: () => import("./pages/login/login").then((archivo) => archivo.Login),

    title: "Login"
}, {
    path: "quien_soy", loadComponent: () => import("./pages/quien-soy/quien-soy").then((archivo) => archivo.QuienSoy),
    title: "¿Quién Soy?"
}, 
{
    path: "",
    redirectTo: "home",
    pathMatch: "full"
},
];
