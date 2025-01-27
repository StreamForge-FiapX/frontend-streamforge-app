import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() logout!: () => void;

  handleLogout(): void {
    if (this.logout) {
      this.logout();
    } else {
      console.error('Logout function is not defined.');
    }
  }
}
