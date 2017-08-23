import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroOradorPage } from './cadastro-orador';

@NgModule({
  declarations: [
    CadastroOradorPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroOradorPage),
  ],
})
export class CadastroOradorPageModule {
}
