import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { Network } from '@ionic-native/network';

export const firebaseConfig = {
  apiKey: "AIzaSyBqem59kEaziuRi5-NFAjSVT4d8N5QHIGk",
  authDomain: "oradores-80dd5.firebaseapp.com",
  databaseURL: "https://oradores-80dd5.firebaseio.com",
  projectId: "oradores-80dd5",
  storageBucket: "oradores-80dd5.appspot.com",
  messagingSenderId: "951609711216"
};

@NgModule({
  declarations: [
    MyApp
    ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
