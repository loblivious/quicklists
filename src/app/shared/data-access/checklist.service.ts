import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';
import { AddChecklist, Checklist } from '../interfaces/Checklist';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private checklists$ = new BehaviorSubject<Checklist[]>([]);

  getChecklists() {
    return this.checklists$.asObservable();
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

  generateSlug(title: string) {
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
