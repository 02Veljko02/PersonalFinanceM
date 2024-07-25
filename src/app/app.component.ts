import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { TextboxeslistComponent } from './textboxeslist/textboxeslist.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, HeaderComponent, TextboxeslistComponent, TransactionsListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'personal-finance-management';
}
