import { ChangeDetectionStrategy, Component,OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  getBooksError,
  getBooksLoaded,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  private unsubscribeObservable$: Subject<void> = new Subject();
  searchForm = this.fb.group({
    term: ''
  });
  getBooksLoaded$: Observable<boolean> = this.store.select(getBooksLoaded);
  getBooksError$: Observable<string> = this.store.select(getBooksError);
  ERROR_TEXT = 'No Result Found !!';
  SPINNER_DIAMETER = 40;
  SPINNER_WIDTH = 2;

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.searchForm.get('term').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribeObservable$))
      .subscribe((searchTerm) => {
        if (searchTerm) {
          this.store.dispatch(searchBooks({ term: searchTerm }));
        } else {
          this.store.dispatch(clearSearch());
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeObservable$.next();
    this.unsubscribeObservable$.complete();
  }

  addBookToReadingList(book: Book): void {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample(): void {
    this.searchForm.controls.term.setValue('javascript');
  }
}
