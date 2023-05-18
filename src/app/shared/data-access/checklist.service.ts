import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  filter,
  map,
  shareReplay,
  take,
  tap,
} from 'rxjs';
import { AddChecklist, Checklist } from '../interfaces/checklist';
import { StorageService } from './storage.service';
import { ChecklistItemService } from 'src/app/checklist/data-access/checklist-item.service';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  // This is the data source where we will emit the latest state
  private checklists$ = new BehaviorSubject<Checklist[]>([]);

  // This is what we will use to consume the checklist data throughout the app
  private sharedChecklists$: Observable<Checklist[]> = this.checklists$.pipe(
    // Trigger a save whenever this stream emits new data
    // Put it here because it emits any time the checklist data changes
    tap((checklists) => this.storageService.saveChecklists(checklists)),
    // Share this stream with multiple subscribers, instead of creating a new one for each
    shareReplay(1)
  );

  constructor(
    private storageService: StorageService,
    private checklistItemService: ChecklistItemService
  ) {}

  load() {
    this.storageService.loadChecklists$
      .pipe(take(1))
      .subscribe((checklists) => this.checklists$.next(checklists));
  }

  getChecklists() {
    return this.sharedChecklists$;
  }

  getChecklistById(id: string) {
    return this.getChecklists().pipe(
      filter((checklists) => checklists.length > 0), // don't emit if checklists haven't loaded yet
      map((checklists) => checklists.find((checklist) => checklist.id === id))
    );
  }

  add(checklist: AddChecklist) {
    const newChecklist = {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };

    this.checklists$.next([...this.checklists$.value, newChecklist]);
  }

  update(id: string, editedData: AddChecklist) {
    const newChecklists = this.checklists$.value.map((checklist) =>
      checklist.id === id
        ? { ...checklist, title: editedData.title }
        : checklist
    );

    this.checklists$.next(newChecklists);
  }

  remove(id: string) {
    const newChecklists = this.checklists$.value.filter(
      (checklist) => checklist.id !== id
    );

    this.checklistItemService.removeAllItemsForChecklist(id);
    this.checklists$.next(newChecklists);
  }

  private generateSlug(title: string) {
    // NOTE: This is a simplistic slug generator and will not handle things like special characters.
    let slug = title.toLowerCase().replace(/\s+/g, '-');
    // Check if the slug already exists
    const matchingSlugs = this.checklists$.value.find(
      (checklist) => checklist.id === slug
    );
    // If the title is already being used, add a string to make the slug unique
    if (matchingSlugs) {
      slug = slug + Date.now().toString();
    }
    return slug;
  }
}
