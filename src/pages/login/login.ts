import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { User } from "../../modals/user";
import * as firebase from 'firebase/app';
import { Network } from "@ionic-native/network";
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  displayName: any;
  user = {} as User;
  connected: Subscription;
  disconnected: Subscription;

  // constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private network: Network) {

    afAuth.authState.subscribe(fbUser => {
      if (!fbUser) {
        this.displayName = null;
        return;
      }
      else {
        if (fbUser.displayName === null)
          this.displayName = fbUser.email;
        else
          this.displayName = fbUser.displayName;

        // console.log(fbUser);
        this.navCtrl.setRoot("HomePage");
        this.navCtrl.popToRoot();
      }
    });

  }

  ionViewDidEnter() {
    this.network.onConnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

    this.network.onDisconnect().subscribe(data => {
      console.log(data);
      this.network.type
      this.toast.create({
        message: `Este aplicativo só funciona online!`,
        duration: 5000,
        position: 'middle'
      }).present();
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
  }

  displayNetworkUpdate(connectionState: string) {
    let networkType = this.network.type
    this.toast.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000
    }).present();
  }

  ionViewWillLeave() {
    if (this.connected)
      this.connected.unsubscribe();
    if (this.disconnected)
      this.disconnected.unsubscribe();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Autenticando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: 'Autenticação falhou!',
      // subTitle: text,
      message: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  async signInWithEmailPassword(user: User) {
    try {
      this.showLoading();
      const signInPasswd = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      if (signInPasswd) {
        this.navCtrl.setRoot("HomePage");
        this.navCtrl.popToRoot();
      }
    }
    catch (error) {
      this.showError(`
      <p><b>Accesso Negado!!!</b></p>
      <p><b>Possíveis Soluções</b></p>
      <ul>
        <li>Solicite ao adminitrador uma nova conta!</li>
        <li>${error.message}</li>
      </ul>
      `);
    }
  }

  async Registrar(user: User) {
    this.showLoading();
    try {
      this.showLoading();
      const result = this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
      if (result) {
        this.showError(`
        <p><b>Registrado com Sucesso!!!</b></p>
        <p><b>Dados cadastrados:</b></p>
        <ul>
          <li>${result.then(data => data.email)}</li>
          <li>${result.then(data => data.uid)}</li>
        </ul>
        `);

      }
    }
    catch (error) {
      let alert = this.alertCtrl.create({
        title: 'Falha ao registrar!',
        subTitle: 'ALERTA!',
        message: `
        <p><b>Possíveis Soluções</b></p>
        <ul>
          <li>Solicite ao adminitrador uma nova conta!</li>
          <li>${error.message}</li>
        </ul>
        `,
        buttons: ['OK']
      });
      alert.present(prompt);
      // console.log(error);    
    }
  }

  signInWithGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(res => {
        // console.log(res);
        this.navCtrl.setRoot("HomePage");
        this.navCtrl.popToRoot();
      })
      .catch(error => {
        let alert = this.alertCtrl.create({
          title: 'Autenticação falhou!',
          subTitle: 'ALERTA',
          message: `
          <p><b>Possíveis Soluções</b></p>
          <ul>
            <li>Solicite ao adminitrador uma nova conta!</li>
            <li>${error.message}</li>
          </ul>
          `,
          buttons: ['OK']
        });
        alert.present(prompt);
      });
  }
}
