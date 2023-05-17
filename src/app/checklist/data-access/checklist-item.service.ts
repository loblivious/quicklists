import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import {
  AddChecklistItem,
  ChecklistItem,
} from 'src/app/shared/interfaces/checklist-item';

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private checklistItems$ = new BehaviorSubject<ChecklistItem[]>([]);

  getItemsByChecklistId(checklistId: string): Observable<ChecklistItem[]> {
    return this.checklistItems$.pipe(
      map((items) =>
        items.filter(
          (checklistItem) => checklistItem.checklistId === checklistId
        )
      )
    );
  }

  add(item: AddChecklistItem, checklistId: string) {
    const newItem = {
      id: Date.now().toString(),
      checklistId,
      checked: false,
      ...item,
    };

    this.checklistItems$.next([...this.checklistItems$.value, newItem]);
  }
}
