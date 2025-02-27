import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Entrega } from 'app/core/entregas/entregas.types';
import { BehaviorSubject, map, Observable, of, ReplaySubject, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EntregasService {
  private _httpClient = inject(HttpClient);
  private _entregas: BehaviorSubject<Entrega[] | null> = new BehaviorSubject(null);

  private _entrega: BehaviorSubject<Entrega | null> = new BehaviorSubject(null);


  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for user
   *
   * @param value
   */

  get entrega$(): Observable<Entrega> {
    return this._entrega.asObservable();
  }

  get entregas$(): Observable<Entrega[]> {
    return this._entregas.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get the current signed-in user data
   */
  get(): Observable<Entrega[]> {
    return this._httpClient.get<Entrega[]>('api/entregas').pipe(
      tap((entregas) => {
        this._entregas.next(entregas);
      }),
    );
  }

  getEntregaPorId(id: string): Observable<Entrega> {
    return this._entregas.pipe(
      take(1),
      map((entregas) => {
        // Find the contact
        const entrega = entregas.find(item => Number(item.id) === Number(id)) || null;
        // Update the contact
        this._entrega.next(entrega);

        console.log('entrega', entrega);
        // Return the contact
        return entrega;
      }),
      switchMap((entrega) => {
        if (!entrega) {
          return throwError('Could not found contact with id of ' + id + '!');
        }

        return of(entrega);
      }),
    );
  }
}
