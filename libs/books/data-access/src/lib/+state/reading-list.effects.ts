import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, filter } from 'rxjs/operators';
import { Book, ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

const SNACK_BAR_CONFIG = {
  UNDO_ACTION: 'Undo',
  DURATION: 4000
}

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item })
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  undoAddtoReadingList$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ReadingListActions.confirmedAddToReadingList),
    filter(({ book }) => book.isOpenSnackBar),
    map(({ book }) =>
      this.openSnackBar(
        { ...book, bookId: book.id, isOpenSnackBar: false },          
        `${book.title}: added to reading list`,
        true
      )
    ),
  ),
  { dispatch: false }
);

undoRemoveFromReadingList$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ReadingListActions.confirmedRemoveFromReadingList),
    filter(({ item }) => item.isOpenSnackBar),
    map(({ item }) =>
      this.openSnackBar(
        { ...item, id: item.bookId, isOpenSnackBar: false },
        `${item.title}: removed from reading list`,
        false
      )
    )
  ),
  { dispatch: false }
);

openSnackBar(item: ReadingListItem | Book, message: string, isAdded: boolean): void {
  this.snackBar.open(message, SNACK_BAR_CONFIG.UNDO_ACTION, {
    duration: SNACK_BAR_CONFIG.DURATION
  })
    .onAction()
    .subscribe(() =>
      isAdded ?
        this.store.dispatch(
          ReadingListActions.removeFromReadingList({
            item: item as ReadingListItem
          })
        ) :
        this.store.dispatch(
          ReadingListActions.addToReadingList({
            book: item as Book
          })
        )
    )
}

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store
  ) {}
}
