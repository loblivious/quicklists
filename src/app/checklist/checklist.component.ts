import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-checklist',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Checklist</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content> </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistComponent {
  checklist$ = this.route.paramMap.pipe(
    switchMap((paramMap) =>
      this.checklistService.getChecklistById(paramMap.get('id') as string)
    )
  );

  constructor(
    private route: ActivatedRoute,
    private checklistService: ChecklistService
  ) {}
}

@NgModule({
  declarations: [ChecklistComponent],
  imports: [
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChecklistComponent,
      },
    ]),
  ],
})
export class ChecklistComponentModule {}
