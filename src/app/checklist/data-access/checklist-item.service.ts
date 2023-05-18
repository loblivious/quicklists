import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, take, tap } from 'rxjs';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import {
  AddChecklistItem,
  ChecklistItem,
} from 'src/app/shared/interfaces/checklist-item';

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private checklistItems$ = new BehaviorSubject<ChecklistItem[]>([]);

  constructor(private storageService: StorageService) {}

  load() {
    this.storageService.loadChecklistItems$
      .pipe(take(1))
      .subscribe((checklistItems) => this.checklistItems$.next(checklistItems));
  }

  getItemsByChecklistId(checklistId: string): Observable<ChecklistItem[]> {
    return this.checklistItems$.pipe(
      map((items) => items.filter((item) => item.checklistId === checklistId)),
      tap(() =>
        this.storageService.saveChecklistItems(this.checklistItems$.value)
      )
    );
  }

  toggle(itemId: string) {
    const newItems = this.checklistItems$.value.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    this.checklistItems$.next(newItems);
  }

  reset(checklistId: string) {
    const newItems = this.checklistItems$.value.map((item) =>
      item.checklistId === checklistId ? { ...item, checked: false } : item
    );

    this.checklistItems$.next(newItems);
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

  update(id: string, editedItem: AddChecklistItem) {
    const newItems = this.checklistItems$.value.map((item) =>
      item.id === id ? { ...item, title: editedItem.title } : item
    );

    this.checklistItems$.next(newItems);
  }

  remove(id: string) {
    const newItems = this.checklistItems$.value.filter(
      (item) => item.id !== id
    );

    this.checklistItems$.next(newItems);
  }

  removeAllItemsForChecklist(checklistId: string) {
    const newItems = this.checklistItems$.value.filter(
      (item) => item.checklistId !== checklistId
    );

    this.checklistItems$.next(newItems);
  }
}
