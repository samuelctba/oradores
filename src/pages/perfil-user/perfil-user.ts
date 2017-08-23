import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";

/**
 * Generated class for the PerfilUserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil-user',
  templateUrl: 'perfil-user.html',
})
export class PerfilUserPage {

  user = {
    displayName: '',
    email: '',
    emailVerified: '',
    isAnonymous: '',
    phoneNumber: '',
    photoURL: '',
    uid: '',
    password: ''
  }

  fbUser: any;

  // displayName:null
  // email:"espife.spike@gmail.com"
  // emailVerified:false
  // isAnonymous:false
  // phoneNumber:null
  // photoURL:null
  // uid:"6bLm8aCByvNro3qZotaTDZahjd82"

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private toast: ToastController) {
    this.user.displayName = navParams.get('displayName');
    this.user.email = navParams.get('email');
    this.user.emailVerified = navParams.get('emailVerified');
    this.user.isAnonymous = navParams.get('isAnonymous');
    this.user.phoneNumber = navParams.get('phoneNumber');
    this.user.photoURL = navParams.get('photoURL');
    this.user.uid = navParams.get('uid');
    this.user.password = navParams.get('password');


  }

  alterarPerfil(usuarioForm) {

    this.afAuth.authState.subscribe((data) => {
      data.updateProfile({
        displayName: usuarioForm.displayName,
        // email: usuarioForm.email,
        // emailVerified: usuarioForm.emailVerified,
        // isAnonymous: usuarioForm.isAnonymous,
        // phoneNumber: usuarioForm.phoneNumber,
        photoURL: usuarioForm.photoURL,
        // uid: usuarioForm.uid,
        // password: usuarioForm.password
      }).then(function () {
        // Update successful.
        console.log("Usuario Atualizado com Sucesso!");
      }).catch(function (error) {
        // An error happened.
        console.log(error.message);
      });

    });

    this.toast.create({
      message: `Usuario Atualizado com Sucesso!`,
      duration: 3000,
      position: 'middle'
    }).present();

    this.navCtrl.pop();

  }

  resetPassword(usuarioForm) {
    this.afAuth.authState.subscribe((data) => {
      data.updatePassword(usuarioForm.password)
        .then(function () {
          // Update successful.
          console.log("Usuario Atualizado com Sucesso!");
        }).catch(function (error) {
          // An error happened.
          console.log(error.message);
        });
    });
    // this.afAuth.auth.sendPasswordResetEmail(usuarioForm.email);
  }

  ionViewDidLoad() {
    if (!this.user.emailVerified) {
      this.afAuth.authState.subscribe((data) => {
        data.sendEmailVerification()
          .then(() => {

            let alert = this.alertCtrl.create({
              title: 'Você ainda não confirmou seu email!',
              subTitle: "Por favor confirme seu email.",
              message: `
                  <p>Email de confirmação foi enviado para:</p>
                  <p>${data.email}</p>
                  `,
              buttons: ['OK']
            });
            alert.present(prompt);
            console.log("email enviado!!!");
          })
          .catch(function (error) {
            // An error happened.
            let alert = this.alertCtrl.create({
              title: 'Erro ao enviar email!',
              message: `
                  <p><b>Possíveis Problemas</b></p>
                  <ul>
                    <li>${error.message}</li>
                  </ul>
                  `,
              buttons: ['OK']
            });
            alert.present(prompt);
            console.log(error.message);
          });
      });
    }
  }


}
