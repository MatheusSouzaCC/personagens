import { Component } from '@angular/core';

import { PersonagensPage } from '../personagens/personagens.component';
import { ConfigPage } from '../configuracoes/configuracoes.component';
import { ItensPendentesPage } from '../itensPendentes/itensPendentes.component';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = PersonagensPage;
  tab2Root = ItensPendentesPage;
  tab3Root = ConfigPage;

  constructor() {

  }
}
