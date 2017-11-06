import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import PouchDB from 'pouchdb';

@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html'
})
export class ConfigPage {

  constructor(public navCtrl: NavController) {

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
}
