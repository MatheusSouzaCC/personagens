import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { PersonagensCadastroPage } from '../personagens/personagensCadastrar.component';
import { PersonagemService } from '../../providers/personagem-service/personagem.service';
import { Personagem } from '../../models/personagens/personagem.model';


@Component({
  selector: 'page-personagens',
  templateUrl: 'personagens.html',
  styles: [`
  .item-md ion-avatar ion-img, .item-md ion-avatar img {
    width:60px; height: 60px
  }
  .item-md {padding-left: 0px;}
  `]
})
export class PersonagensPage implements OnInit {
  personagens: Personagem[];
  loading: any;

  constructor(public navCtrl: NavController, private personagemService: PersonagemService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController) {
    this.loading = this.loadingCtrl.create({
      content: "Carregando, por favor aguarde"
    });
  }

  ngOnInit(): void {
    this.loading.present();
  }

  ionViewDidLoad() {
    this.personagemService.getPersonagens()
      .then((personagens: Personagem[]) => {
        this.personagens = personagens;
        this.loading.dismiss();
      }).catch(err => alert(err));
  };



  public cadastrarPersonagem() {
    this.navCtrl.push(PersonagensCadastroPage)
  }

  public deletarPersonagem(personagem, event) {
    event.stopPropagation();

    let confirm = this.alertCtrl.create({
      title: 'Deletar personagem?',
      message: personagem.nome + ' será deletado permanentemente',
      buttons: [
        {
          text: 'Não'
        },
        {
          text: 'Sim',
          handler: () => {
            this.personagemService.deletePersonagem(personagem)
              .then((retorno: any) => {
                let toast = this.toastCtrl.create({
                  message: 'Personagem deletado !',
                  duration: 3000
                });
                toast.present();
              });
          }
        }
      ]
    });
    confirm.present();
  }

  public editarPersonagem(p){
    this.navCtrl.push(PersonagensCadastroPage,{personagem: p})
  }
}
