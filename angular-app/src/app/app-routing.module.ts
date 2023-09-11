import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from './pages/upload/upload.component';
import { RegistrosComponent } from './pages/registros/registros.component';

const routes: Routes = [
  { path: 'upload', component: UploadComponent },
  { path: 'registros', component: RegistrosComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
