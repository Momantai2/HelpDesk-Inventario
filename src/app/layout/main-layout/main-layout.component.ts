import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { DashboardComponent } from '../dashboardd/dashboard.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [RouterOutlet, DashboardComponent, HeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}