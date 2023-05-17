import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { FormModalComponentModule } from '../shared/ui/form-modal.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title> Home </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="formModalIsOpen$.next(true)">
            <ion-icon name="add" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-modal
        [isOpen]="formModalIsOpen$ | async"
        [canDismiss]="true"
        (ionModalDidDismiss)="formModalIsOpen$.next(false)"
      >
        <ng-template>
          <app-form-modal
            title="Create checklist"
            [formGroup]="checklistForm"
          ></app-form-modal>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  formModalIsOpen$ = new BehaviorSubject<boolean>(false);

  checklistForm = this.fb.group({
    title: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {}
}

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormModalComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
  ],
})
export class HomeComponentModule {}
