import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import {Personagem} from '../../models/personagens/personagem.model';
import {ToastController } from 'ionic-angular'; 

@Injectable()
export class PersonagemService {
 
  data: Personagem[];
  db: any;
  remote: any;
 
  constructor(public toastCtrl: ToastController) {
 
    this.db = new PouchDB('personagens');
 
    this.remote = 'http://192.168.0.109:5984/personagens';
 
    let options = {
      live: true,
      retry: true,
      continuous: true
    };
    
    
    this.db.sync(this.remote, options);
 
  }
 
  private presentToast(msg,duration) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: duration
    });
    toast.present();
  }

  getPersonagens() {
    if (this.data) {      
      return Promise.resolve(this.data);
    }
    
    return new Promise(resolve => {
  
      this.db.allDocs({
   
        include_docs: true,
        attachments: true
   
      }).then((result) => {
        //limpa o array
        this.data = new Array<Personagem>();
   
        let docs = result.rows.map((row) => {
          var personagem = new Personagem();

          personagem._id = row.doc._id;
          personagem._rev = row.doc._rev;
          personagem.descricao = row.doc.descricao;
          personagem.nome = row.doc.nome;
          personagem.universo = row.doc.universo;
          personagem._attachments = row.doc._attachments;
          
          if(row.doc._attachments){
            var fileName = Object.keys(row.doc._attachments)[0];
            personagem.base64 = row.doc._attachments[fileName].data;
          }

          if(personagem.base64 == undefined){
            personagem.base64 = 'assets/img/semFoto.jpg';
          }
          
          this.data.push(personagem);
        });
   
        resolve(this.data);
   
        this.db.changes({live: true, since: 'now', include_docs: true,attachments: true}).on('change', (change) => {
          this.handleChange(change);
        });
   
      }).catch((error) => {
        console.log(error);
      });
   
    });
  }
 
  createPersonagem(personagem){
    this.db.post(personagem);
  }
 
  updatePersonagem(personagem){
    this.db.put(personagem).catch((err) => {
      alert('Ocorreu um erro ao remover o personagem');
    });
  }
 
  deletePersonagem(personagem){
    return this.db.remove(personagem).catch((err) => {

    });
  }
 
  handleChange(change){
    let changedDoc = null;
    let changedIndex = null;

    var personagem = new Personagem();
    
    personagem._id = change.doc._id;
    personagem._rev = change.doc._rev;
    personagem.descricao = change.doc.descricao;
    personagem.nome = change.doc.nome;
    personagem.universo = change.doc.universo;
    personagem._attachments = change.doc._attachments;

    if(change.doc._attachments){
      var fileName = Object.keys(change.doc._attachments)[0];
      personagem.base64 = change.doc._attachments[fileName].data;
    }

    if(personagem.base64 == undefined){
      personagem.base64 = 'assets/img/semFoto.jpg';
    }
   
    this.data.forEach((personagem, index) => {
   
      if(personagem._id === change.id){
        changedDoc = personagem;
        changedIndex = index;
      }
   
    });
   
    //A document was deleted
    if(change.deleted){
      this.data.splice(changedIndex, 1);
    }
    else {
   
      //A document was updated
      if(changedDoc){        
        this.data[changedIndex] = personagem;
      }
   
      //A document was added
      else {
        this.data.push(personagem);
      }
   
    }
    this.presentToast("Dados atualizados",2000);
  }
 
}