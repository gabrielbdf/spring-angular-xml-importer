import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
      <p style="margin: 0;">
        <mat-toolbar color="primary">
          <button (click)="drawer.toggle()" mat-icon-button  aria-label="Menu">
            <mat-icon>menu</mat-icon>
          </button>
          <span>Desafio V1</span>
          <span class="spacer"></span>
          <button [routerLink]="['upload']" mat-icon-button class="favorite-icon" aria-label="Upload">
            <mat-icon>upload</mat-icon>
          </button>
          <button [routerLink]="['registros']" mat-icon-button aria-label="Example icon-button with share icon">
            <mat-icon>list</mat-icon>
          </button>
        </mat-toolbar>
    </p>
    <mat-drawer-container  class="nav-container" autosize>
      <mat-drawer [opened]="true"  #drawer class="sidenav" mode="side">
      <mat-list>
        <mat-list-item>
          <button [routerLink]="['upload']" [routerLinkActive]="'mat-primary'" mat-button>Upload</button>
        </mat-list-item>
        <mat-list-item>
          <button [routerLink]="['registros']" [routerLinkActive]="'mat-primary'" mat-button>Registros</button>
        </mat-list-item>
      </mat-list>
      </mat-drawer>
      <div class="sidenav-content">
        <router-outlet></router-outlet>
      </div>
    </mat-drawer-container>
   
  `,
  styles: []
})
export class AppComponent {
  title = 'desafio-v1';
}
