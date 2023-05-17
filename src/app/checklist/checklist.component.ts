import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject, combineLatest, filter, switchMap } from 'rxjs';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { FormModalComponentModule } from '../shared/ui/form-modal.component';
import { ChecklistItemService } from './data-access/checklist-item.service';
import { ChecklistItemListComponentModule } from './ui/checklist-item-list/checklist-item-list.component';
import { Checklist } from '../shared/interfaces/checklist';

@Component({
  selector: 'app-checklist',
  template: `
    <ng-container
      *ngIf="{
        checklist: (checklist$ | async)!,
        formModalIsOpen: (formModalIsOpen$ | async)!
      } as vm"
    >
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/"></ion-back-button>
          </ion-buttons>
          <ion-title>
            {{ vm.checklist.title }}
          </ion-title>
          <ion-buttons slot="end">
            <ion-button (click)="formModalIsOpen$.next(true)">
              <ion-icon name="add" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <app-checklist-item-list [checklistItems]=""></app-checklist-item-list>
        <ion-modal
          [isOpen]="vm.formModalIsOpen"
          [canDismiss]="true"
          (ionModalDidDismiss)="formModalIsOpen$.next(false)"
        >
          <ng-template>
            <app-form-modal
              title="Create item"
              [formGroup]="checklistItemForm"
              (save)="addChecklistItem(vm.checklist.id)"
            ></app-form-modal>
          </ng-template>
        </ion-modal>
      </ion-content>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistComponent {
  checklistAndItems$ = this.route.paramMap.pipe(
    switchMap((params) =>
      combineLatest([
        this.checklistService
          .getChecklistById(params.get('id') as string)
          .pipe(filter((checklist): checklist is Checklist => !!checklist)),
        this.checklistItemServic.getItemsByChecklistId(
          params.get('id') as string
        ),
      ])
    )
  );

  formModalIsOpen$ = new BehaviorSubject<boolean>(false);

  checklistItemForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
  });

  constructor(
    private route: ActivatedRoute,
    private checklistService: ChecklistService,
    private fb: FormBuilder,
    private checklistItemServic: ChecklistItemService
  ) {}

  addChecklistItem(checklistId: string) {
    this.checklistItemServic.add(
      this.checklistItemForm.getRawValue(),
      checklistId
    );
  }
}

@NgModule({
  declarations: [ChecklistComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormModalComponentModule,
    ChecklistItemListComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChecklistComponent,
      },
    ]),
  ],
})
export class ChecklistComponentModule {}
