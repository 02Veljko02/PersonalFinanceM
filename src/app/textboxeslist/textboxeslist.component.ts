import { Component } from '@angular/core';

@Component({
  selector: 'app-textboxeslist',
  standalone: true,
  imports: [],
  templateUrl: './textboxeslist.component.html',
  styleUrls: ['./textboxeslist.component.css']
})
export class TextboxeslistComponent {
  selectedOption = 'Select an option';
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(event: Event, option: string) {
    event.preventDefault(); // Sprečava podrazumevano ponašanje linka
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  clearDropdown() {
    this.selectedOption = 'Select an option';
    this.isDropdownOpen = false;
  }
}
