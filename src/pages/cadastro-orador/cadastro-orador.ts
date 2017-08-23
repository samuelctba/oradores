import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { Orador } from "../../modals/orador";

/**
 * Generated class for the CadastroOradorPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro-orador',
  templateUrl: 'cadastro-orador.html',
})
export class CadastroOradorPage {
  $key: any;
  editMode: boolean = false;

  createSuccess = false;

  orador : Orador = new Orador();

  registerCredentials = {
    dataDiscurso: new Date().toISOString().substring(0, 10),
    nomeOrador: '',
    congregacao: '',
    numeroEsboco: '',
    temaDiscurso: '',
    telefoneContato: '',
    email: '',
    createdby: '',

    // createdDate: new Date().toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$2-$1-$3')
    // createdDate: new Date().toJSON().slice(0,10)
    createdDate: new Date().toLocaleDateString("pt-br", { year: "numeric", month: "numeric", day: "numeric" }).replace(/\s/g, '-'),
    lastUpdate: new Date().toISOString().substring(0, 10)
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private afDB: AngularFireDatabase, ) {

      // this.orador.$key = this.navParams.get('$key');
      // this.orador.dataDiscurso = this.navParams.get('dataDiscurso');
      // this.orador.nomeOrador = this.navParams.get('nomeOrador');
      // this.orador.congregacao = this.navParams.get('congregacao');
      // this.orador.numeroEsboco = this.navParams.get('numeroEsboco');
      // this.orador.temaDiscurso = this.navParams.get('temaDiscurso');
      // this.orador.telefoneContato = this.navParams.get('telefoneContato');
      // this.orador.email = this.navParams.get('email');
      // this.orador.createdby = this.navParams.get('createdby');
      // this.orador.createdDate = this.navParams.get('createdDate');
      // this.orador.lastUpdate = this.navParams.get('lastUpdate');


    if (navParams.get('$key') !== null || navParams.get('$key') !== undefined) {
      this.editMode = true;
      this.$key = navParams.get('$key');
      this.registerCredentials.dataDiscurso = navParams.get('dataDiscurso');
      this.registerCredentials.nomeOrador = navParams.get('nomeOrador');
      this.registerCredentials.congregacao = navParams.get('congregacao');
      this.registerCredentials.numeroEsboco = navParams.get('numeroEsboco');
      this.registerCredentials.temaDiscurso = navParams.get('temaDiscurso');
      this.registerCredentials.telefoneContato = navParams.get('telefoneContato');
      this.registerCredentials.email = navParams.get('email');
      this.registerCredentials.createdby =(navParams.get('createdby') == undefined) ? new Date().toISOString().substring(0, 10) : ' ';
      this.registerCredentials.createdDate = (navParams.get('createdDate') == undefined) ? new Date().toISOString().substring(0, 10) : ' ';
      this.registerCredentials.lastUpdate = new Date().toISOString().substring(0, 10);
    }else{
      this.registerCredentials.createdby = navParams.get('email');
      this.registerCredentials.createdDate = (navParams.get('createdDate') == undefined) ? new Date().toISOString().substring(0, 10) : ' ';
      this.registerCredentials.lastUpdate = (navParams.get('lastUpdate') == undefined) ? new Date().toISOString().substring(0, 10) : ' ';
    }

    // this.myForm = this.formBuilder.group({
    //   'serial':['', [Validators.required, Validators.minLength(9), Validators.pattern('[0-9]{1}[a-zA-Z]{2}[0-9]{6}')]]
    //   });

  }

  public cadastrarNovoArranjo() {
    try {
      const cadastro = this.afDB.list('/arranjos').push(this.registerCredentials);
      if (cadastro) {
        this.createSuccess = true;
        this.showPopup("Sucesso!", "Novo Arranjo Criado com sucesso!");
      } else {
        this.showPopup("Erro", "Ocorreu um erro ao cadastrar novo arranjo!");
      }
    }
    catch (error) {
      this.showPopup("Error", error.message);
    }
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.navCtrl.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

  editar(registerCredentials){
    try {
      const edicao = this.afDB.list('/arranjos').update(this.$key,registerCredentials);
      if (edicao) {
        this.createSuccess = true;
        this.showPopup("Sucesso!", "Arranjo editado com sucesso!");
      } else {
        this.showPopup("Erro", "Ocorreu um erro ao editar o arranjo!");
      }
    }
    catch (error) {
      this.showPopup("Error", error.message);
    }
  }

}
