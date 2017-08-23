import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerfilUserPage } from './perfil-user';

@NgModule({
  declarations: [
    PerfilUserPage,
  ],
  imports: [
    IonicPageModule.forChild(PerfilUserPage),
  ],
})
export class PerfilUserPageModule {}
