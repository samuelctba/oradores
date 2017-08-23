import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Orador } from "../../modals/orador";


/**
 * Generated class for the DetalhesOradorPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalhes-orador',
  templateUrl: 'detalhes-orador.html'
})
export class DetalhesOradorPage {

  orador: Orador = new Orador();

  // orador.dataDiscurso : string = this.navParams.get('dataDiscurso');
  // orador.nomeOrador : string = this.navParams.get('nomeOrador');
  // orador.congregacao : string = this.navParams.get('congregacao');
  // orador.numeroEsboco : string = this.navParams.get('numeroEsboco');
  // orador.temaDiscurso : string = this.navParams.get('temaDiscurso');
  // orador.telefoneContato : string = this.navParams.get('telefoneContato');

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {

    this.orador.$key = this.navParams.get('$key');
    this.orador.dataDiscurso = this.navParams.get('dataDiscurso');
    this.orador.nomeOrador = this.navParams.get('nomeOrador');
    this.orador.congregacao = this.navParams.get('congregacao');
    this.orador.numeroEsboco = this.navParams.get('numeroEsboco');
    this.orador.temaDiscurso = this.navParams.get('temaDiscurso');
    this.orador.telefoneContato = this.navParams.get('telefoneContato');
    this.orador.email = this.navParams.get('email');
    this.orador.createdby = this.navParams.get('createdby');
    this.orador.createdDate = this.navParams.get('createdDate');
    this.orador.lastUpdate = this.navParams.get('lastUpdate');

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  callIT(mobNumber: string) {
    window.open("tel:" + mobNumber);
  }

  editUser() {
    this.navCtrl.push("CadastroOradorPage", this.orador);
  }

}
