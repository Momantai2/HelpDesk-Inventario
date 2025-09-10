import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { RolComponent } from './crud/rol/rol.component';
import { TicketComponent } from './crud/ticket/ticket.component';
import { HomeComponent } from './home/home.component';
import { ComentarioComponent } from './crud/comentario/comentario.component';
import { EstadoComponent } from './crud/estado/estado.component';
import { UsuarioComponent } from './crud/usuario/usuario.component';
import { PrioridadComponent } from './crud/prioridad/prioridad.component';
import { RoleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AreaComponent } from './crud/area/area.component';
import { SubAreaComponent } from './crud/subArea/subArea.component';
import { DistritoComponent } from './crud/distrito/distrito.component';
import { ProvinciaComponent } from './crud/provincia/provincia.component';
import { SucursalComponent } from './crud/sucursal/sucursal.component';
import { TipoSucursalComponent } from './crud/tipo-sucursal/tipoSucursal.component';
import { tipoSubAreaComponent } from './crud/tipoSubArea/tipoSubArea.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'rol',
        component: RolComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'ticket',
        component: TicketComponent,
        canActivate: [RoleGuard],
        data: { roles: [1, 2] },
      },
      {
        path: 'comentario',
        component: ComentarioComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'estado',
        component: EstadoComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'usuario',
        component: UsuarioComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'prioridad',
        component: PrioridadComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'distrito',
        component: DistritoComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'provincia',
        component: ProvinciaComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'sucursal',
        component: SucursalComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'tipo-sucursal',
        component: TipoSucursalComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'areas',
        component: AreaComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'subareas',
        component: SubAreaComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },
      {
        path: 'tiposubareas',
        component: tipoSubAreaComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] },
      },

      {
        path: 'home',
        component: HomeComponent,
        canActivate: [RoleGuard],
        data: { roles: [1, 2, 3] },
      },
    ],
  },
];
