import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-form-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form [formGroup]="formGroup" (ngSubmit)="handleSave()">
        <ion-item *ngFor="let control of formGroup.controls | keyvalue">
          <ion-input
            type="text"
            [label]="control.key"
            labelPlacement="stacked"
            [formControlName]="control.key"
          ></ion-input>
        </ion-item>
        <ion-button
          color="dark"
          expand="full"
          type="submit"
          [disabled]="!formGroup.valid"
        >
          <ion-icon name="save-outline" slot="start"></ion-icon> Save
        </ion-button>
      </form>
    </ion-content>
  `,
  styles: [
    `
      :host {
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormModalComponent {
  @Input() title!: string;
  @Input() formGroup!: FormGroup;

  @Output() save = new EventEmitter<boolean>();

  constructor(private modalControl: ModalController) {}

  handleSave() {
    this.save.emit(true);
    this.dismiss();
  }

  dismiss() {
    this.formGroup.reset();
    this.modalControl.dismiss();
  }
}

@NgModule({
  declarations: [FormModalComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  exports: [FormModalComponent],
})
export class FormModalComponentModule {}