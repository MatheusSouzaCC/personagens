import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Config} from 'ionic-angular' 
import PouchDB from 'pouchdb';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html'
})
export class ConfigPage {
  public Url: string;

  constructor(public navCtrl: NavController, public config: Config,public events: Events) {
      this.Url = this.config.get('urlbd');
  }
  public limparBase() {
    if (confirm("Tem certeza ? Os dados não sincronizados serão perdidos !")) {
      new PouchDB('personagens').destroy().then(function () {
      alert('Base limpa.');
      }).catch(function (err) {
        alert(err);
      })
    }
  }

  public alterarURLDataBase(){        
    this.config.set('android','urlbd', this.Url);
    this.events.publish('url:changed', this.Url);
    alert('Configurações salvas para essa sessão');
  }
}
