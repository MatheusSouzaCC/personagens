import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { PersonagensPage } from '../pages/personagens/personagens.component';
import { PersonagensCadastroPage } from '../pages/personagens/personagensCadastrar.component';
import { ConfigPage } from '../pages/configuracoes/configuracoes.component';
import { ItensPendentesPage } from '../pages/itensPendentes/itensPendentes.component';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SuperTabsModule } from 'ionic2-super-tabs';
import { PersonagemService } from '../providers/personagem-service/personagem.service';
import{SafeHtml} from '../utils/safehtml';

import { ImagePicker } from '@ionic-native/image-picker';
import { Camera} from '@ionic-native/camera';
import { File } from '@ionic-native/file';


@NgModule({
  declarations: [
    MyApp,
    PersonagensPage,
    PersonagensCadastroPage,
    ConfigPage,
    ItensPendentesPage,
    TabsPage,
    SafeHtml
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      urlbd: "http://192.168.0.103:5984/personagens"
    }),
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PersonagensPage,
    PersonagensCadastroPage,
    ConfigPage,
    ItensPendentesPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PersonagemService,
    PersonagemService,
    ImagePicker,
    Camera,
    File
  ]
})
export class AppModule {}
