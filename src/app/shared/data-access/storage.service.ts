import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, from, map, shareReplay, switchMap, take, tap } from 'rxjs';
import { Checklist } from '../interfaces/checklist';
import { ChecklistItem } from '../interfaces/checklist-item';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  #checklistHasLoaded = false;
  #checklistItemsHasLoaded = false;

  storage$ = from(this.storage.create()).pipe(shareReplay(1));
  loadChecklists$: Observable<Checklist[]> = this.storage$.pipe(
    switchMap((storage) => from(storage.get('checklists'))),
    map((checklist) => checklist ?? []),
    tap(() => (this.#checklistHasLoaded = true)),
    shareReplay(1)
  );
  loadChecklistItems$: Observable<ChecklistItem[]> = this.storage$.pipe(
    switchMap((storage) => from(storage.get('checklistItems'))),
    map((checklistItems) => checklistItems ?? []),
    tap(() => (this.#checklistItemsHasLoaded = true)),
    shareReplay(1)
  );

  constructor(private storage: Storage) {}

  saveChecklists(checklists: Checklist[]) {
    if (this.#checklistHasLoaded) {
      // use take(1) to make sure we unsubscribe from the stream
      this.storage$.pipe(take(1)).subscribe((storage) => {
        storage.set('checklists', checklists);
      });
    }
  }

  saveChecklistItems(checklistItems: ChecklistItem[]) {
    if (this.#checklistItemsHasLoaded) {
      this.storage.set('checklistItems', checklistItems);
    }
  }

  // saveChecklistItems(checklistItems: ChecklistItem[]) {
  //   if (this.#checklistItemsHasLoaded) {
  //     this.storage$.pipe(take(1)).subscribe((storage) => {
  //       storage.set('checklistItems', checklistItems);
  //     });
  //   }
  // }
}
