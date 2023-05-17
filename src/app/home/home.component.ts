import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { FormModalComponentModule } from '../shared/ui/form-modal.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ChecklistListComponentModule } from './ui/checklist-list/checklist-list.component';

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
      <app-checklist-list
        *ngIf="checklists$ | async as checklists"
        [checklists]="checklists"
      ></app-checklist-list>

      <ion-modal
        [isOpen]="formModalIsOpen$ | async"
        [canDismiss]="true"
        (ionModalDidDismiss)="formModalIsOpen$.next(false)"
      >
        <ng-template>
          <app-form-modal
            title="Create checklist"
            [formGroup]="checklistForm"
            (save)="addChecklist()"
          ></app-form-modal>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  formModalIsOpen$ = new BehaviorSubject<boolean>(false);
  checklists$ = this.checklistService.getChecklists();

  checklistForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private checklistService: ChecklistService
  ) {}

  addChecklist() {
    this.checklistService.add(this.checklistForm.getRawValue());
  }
}

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormModalComponentModule,
    ChecklistListComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
  ],
})
export class HomeComponentModule {}
