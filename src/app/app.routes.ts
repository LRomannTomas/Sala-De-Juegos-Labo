import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Error } from './pages/error/error';
import { noLoginGuard } from './guards/no-login-guard';
import { loginGuard } from './guards/login-guard';


export const routes: Routes = [{
    path: "home", component: Home,
    title: "Sala de Juegos"
}, {
    path: "registro", loadComponent: () => import("./pages/registro/registro").then((archivo) => archivo.Registro),
    canActivate: [noLoginGuard],
    title: "Registro"
}, {
    path: "login", loadComponent: () => import("./pages/login/login").then((archivo) => archivo.Login),
    canActivate: [noLoginGuard],
    title: "Login"
}, {
    path: "quien_soy", loadComponent: () => import("./pages/quien-soy/quien-soy").then((archivo) => archivo.QuienSoy),
    title: "¿Quién Soy?"
}, {
    path: "juegos",
    children: [
        {
            path: "",
            redirectTo: "calculo-mental",
            pathMatch: "full"
        },
        {
            path: "ahorcado", loadComponent: () => import("./pages/ahorcado/ahorcado").then((archivo) => archivo.Ahorcado),
            canActivate: [loginGuard],
            title: "Ahorcado"
        },
        {
            path: "preguntados", loadComponent: () => import("./pages/preguntados/preguntados").then((archivo) => archivo.Preguntados),
            canActivate: [loginGuard],
            title: "Preguntados"
        },
        {
            path: "mayor-menor", loadComponent: () => import("./pages/mayor-menor/mayor-menor").then((archivo) => archivo.MayorMenor),
            canActivate: [loginGuard],
            title: "Mayor o Menor"
        },
        {
            path: "calculo-mental", loadComponent: () => import("./pages/calculo-mental/calculo-mental").then((archivo) => archivo.CalculoMental),
            canActivate: [loginGuard],
            title: "Calculo Mental"
        }
    ]
}, {
    path: "chat", loadComponent: () => import("./pages/chat/chat").then((archivo) => archivo.Chat),
    canActivate: [loginGuard],
    title: "Sala de Chat"
}, {
    path: "resultados", loadComponent: () => import("./pages/resultados/resultados").then((archivo) => archivo.Resultados),
    canActivate: [loginGuard],
    title: "Resultados"
}, {
    path: "error", component: Error,
    title: "Error"
}, {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
}, {
    path: "**",
    component: Error
}
];
