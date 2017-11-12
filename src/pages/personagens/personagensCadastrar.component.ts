import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { PersonagensPage } from '../personagens/personagens.component';
import { PersonagemService } from '../../providers/personagem-service/personagem.service';
import { Personagem } from '../../models/personagens/personagem.model';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-personagensCadastrar',
  templateUrl: 'personagensCadastrar.html'

})
export class PersonagensCadastroPage {

  personagem: Personagem;
  cameraOptions: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  constructor(public navCtrl: NavController,
    private personagemService: PersonagemService,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    private imagePicker: ImagePicker,
    private camera: Camera,
    private file: File) {
    if (this.navParams.get("personagem")) {
      let p = this.navParams.get("personagem");
      this.personagem = new Personagem();
      this.personagem.nome = p.nome;
      this.personagem.descricao = p.descricao;
      this.personagem.universo = p.universo;
      this.personagem._id = p._id;
      this.personagem._rev = p._rev;
      this.personagem._attachments = p._attachments;
      this.personagem.base64 = p.base64;
    } else {
      this.personagem = new Personagem();
    }

  }
  public cancelar() {
    this.navCtrl.setRoot(PersonagensPage)
  }
  public cadastrar() {
    if (!this.personagem.descricao || !this.personagem.nome || !this.personagem.universo) {
      this.showAlert("Atenção!", "Preencha todos os campos !");
    } else {
      if (!this.personagem.base64) {
        this.personagem.base64 = 'assets/img/semFoto.jpg';
      }
      if (!this.personagem._id) {
        this.personagemService.createPersonagem(this.personagem);
        this.navCtrl.setRoot(PersonagensPage)
      } else {
        this.personagemService.updatePersonagem(this.personagem);
        this.navCtrl.setRoot(PersonagensPage)
      }
    }
  }

  private showAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  public escolherImagem() {
    let options = { maximumImagesCount: 1 };

    if (this.imagePicker.hasReadPermission()) {

      this.imagePicker.getPictures(options).then((results) => {
        if (results.length > 1) {
          alert("Somente uma imagem é permitida. A primeira imagem será utilizada");
        }

        var imagePath = results[0].substr(0, results[0].lastIndexOf('/') + 1);
        var imageName = results[0].substr(results[0].lastIndexOf('/') + 1);

        this.file.readAsDataURL(imagePath, imageName).then((b64str) => {
          var rawBase64 = b64str.substring(b64str.indexOf(',') + 1);
          var contentType = b64str.substring(b64str.indexOf(':') + 1, b64str.indexOf(';'));

          this.personagem.base64 = b64str;
          this.personagem._attachments = {
            [imageName]: {
              content_type: contentType,
              data: rawBase64
            }
          };

        }).catch(err => {
          console.log('readAsDataURL failed: (' + err.code + ")" + err.message);
        });

      }, (err) => { console.log(err) });
    } else {
      this.imagePicker.requestReadPermission();
      this.escolherImagem();
    }
  }

  public tirarFoto() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {

      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.personagem.base64 = base64Image;
      this.personagem._attachments = {
        "foto.jpeg": {
          content_type: 'image/jpeg',
          data: imageData
        }
      };

    }, (err) => {
      alert("Não foi possível processar a imagem");
    });
  }

  public removerImagem() {
    this.personagem.base64 = 'assets/img/semFoto.jpg';
    this.personagem._attachments = {};
  }

}

