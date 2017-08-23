import { Component } from '@angular/core';
import { NavController, IonicPage, ToastController, ModalController, LoadingController, AlertController, Alert } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase/app';
import { Network } from "@ionic-native/network";
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  alert: Alert;

  userID: string = '10'
  password: string;
  email: string;
  displayName: any;
  // oradores: FirebaseListObservable<any[]>;
  oradores: any;
  user: firebase.User;
  connected: Subscription;
  disconnected: Subscription;


  hoje = new Date().toISOString().slice(0, 10);
  today = new Date();

  // get current date 
  first = this.today.getDate() - this.today.getDay(); // First day is the day of the month - the day of the week 
  last = this.first + 7; // last day is the first day + 6 
  firstday = new Date(this.today.setDate(this.first));
  lastday = new Date(this.today.setDate(this.today.getDate() + 6));

  end_of_week = new Date(this.today.getTime() + (7 - this.today.getDay()) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  constructor(public navCtrl: NavController,
    private afDB: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private network: Network) {

    // afDB.list('/oradores-80dd5').subscribe(data => this.oradores = data);
    // var date = new Date();
    // console.log(('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear());
    // var today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    // console.log(today);

  }


  isInThisWeek(dataDiscurso) {
    // console.log(dataDiscurso);
    let today = new Date(dataDiscurso);
    // console.log(today);
    if (today > this.firstday && today < this.lastday)
      return true;
    else
      return false;
  }

  ionViewDidEnter() {
    this.network.onConnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

    this.network.onDisconnect().subscribe(data => {
      console.log(data)
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

  ngOnInit() {
    this.presentLoading();

    this.afAuth.authState.subscribe(fbUser => {
      this.user = fbUser;
      // console.log(fbUser);
      if (!fbUser) {
        this.toast.create({
          message: `Você não está autenticado!`,
          duration: 3000,
          position: 'top'
        }).present();

        this.displayName = null;
        this.userID = null;

        this.navCtrl.setRoot("LoginPage");
        return;
      }
      else {
        this.displayName = fbUser.email;
        this.userID = fbUser.uid;
        if (fbUser.uid) {
          // let ref = this.afDB.database.ref('arranjos').orderByChild('numeroEsboco').limitToLast(10);
          // console.log(ref);

          this.afDB.list('/arranjos', {
            query: {
              orderByChild: "dataDiscurso",
              limitToLast: 10
            }
          })
            .subscribe(data => {
              data.reverse();
              this.oradores = data;
            });
          this.toast.create({
            message: `Bem Vindo ao aplicativo para auxiliar no arranjo de oradores , ${this.displayName}`,
            duration: 3000,
            position: 'top'
          }).present();
        }
      }
    });
  }


  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 2000
    });
    loader.present();
  }

  signInWithGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(res => console.log(res))
      .catch(error => console.log(error));
  }

  signInWithEmailPassword() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(res => console.log(res))
      .catch(error => console.log(error));
  }

  signOut() {
    console.log("SignOut!");
    this.user = null;
    this.userID = null;
    this.afDB.database.goOffline();
    this.afAuth.auth.signOut();
    this.navCtrl.setRoot("LoginPage");
    console.log("Gone to Login Page");
  }

  deleteOrador(orador) {
    this.alert = this.alertCtrl.create({
      title: 'Excluir Arranjo?',
      message: 'Tem certeza que quer excluir esse arranjo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.alert = null;
          }
        },
        {
          text: 'Sim Excluir',
          handler: () => {
            this.afDB.list('/arranjos').remove(orador.$key)
              .then(data => {
                if (data !== null) {
                  console.log(data);
                  this.toast.create({
                    message: `Arranjo para o orador ${orador.nomeOrador} foi excluído com sucesso!`,
                    duration: 3000,
                    position: 'top'
                  }).present();
                }
              })
              .catch(error => console.log(error.message));
          }
        }
      ]
    });
    this.alert.present();
  }


  doRefresh(refresher) {
    // console.log('Begin async operation', refresher);
    this.afDB.list('/arranjos', { query: { orderByChild: "dataDiscurso", limitToLast: 10 } })
      .subscribe(data => { data.reverse(); this.oradores = data; });
    setTimeout(() => {
      // console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  openPageDetalhesOrador(orador) {
    this.navCtrl.push("DetalhesOradorPage", orador);
  }

  openPagePerfil() {
    this.navCtrl.push("PerfilUserPage", this.user);
  }

  openPageCadastroOrador() {
    this.navCtrl.push("CadastroOradorPage", this.user);
  }

}
