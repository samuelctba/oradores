import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalhesOradorPage } from './detalhes-orador';

@NgModule({
  declarations: [
    DetalhesOradorPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalhesOradorPage),
  ],
})
export class DetalhesOradorPageModule {}
