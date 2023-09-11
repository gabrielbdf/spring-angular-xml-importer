import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { BehaviorSubject, map, merge, of, startWith, switchMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';

@Component({
  selector: 'app-registros',
  template: `
    <div class="example-container mat-elevation-z8 p-2">
      <h4>Selecione a região</h4>
      <mat-form-field>
        <mat-label>Região</mat-label>
        <mat-select (selectionChange)="mudarRegiao($event)">
          <mat-option [value]="sigla" *ngFor="let sigla of regioes">
            {{sigla}}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <div class="example-table-container">
        <table mat-table [dataSource]="data" class="example-table">

          <ng-container matColumnDef="agente">
            <th mat-header-cell *matHeaderCellDef>Agente</th>
            <td mat-cell *matCellDef="let row">{{row.codigoAgente}}</td>
          </ng-container>

          <ng-container matColumnDef="data">
            <th mat-header-cell *matHeaderCellDef>Data</th>
            <td mat-cell *matCellDef="let row">{{row.data | date:'dd/MM/yyyy'}}</td>
          </ng-container>
          
          <ng-container matColumnDef="sigla">
            <th mat-header-cell *matHeaderCellDef>Região</th>
            <td mat-cell *matCellDef="let row">{{row.siglaRegiao}}</td>
          </ng-container>

          <ng-container matColumnDef="geracao">
            <th mat-header-cell *matHeaderCellDef>Geração</th>
            <td mat-cell *matCellDef="let row">
              {{row.geracao.join(" | ")}}
            </td>
          </ng-container>

          <ng-container matColumnDef="total_geracao">
            <th mat-header-cell *matHeaderCellDef>Total Geração</th>
            <td mat-cell *matCellDef="let row">
              <mat-chip>
              {{row.geracao | soma}}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="compra">
            <th mat-header-cell *matHeaderCellDef>Compra</th>
            <td mat-cell *matCellDef="let row">
                {{row.compra.join(" | ")}} 
            </td>
          </ng-container>

          <ng-container matColumnDef="total_compra">
            <th mat-header-cell *matHeaderCellDef>Total Compra</th>
            <td mat-cell *matCellDef="let row">
              <mat-chip>
                {{row.compra | soma}}
              </mat-chip>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="colunas"></tr>
          <tr mat-row *matRowDef="let row; columns: colunas;"></tr>
        </table>
      </div>

      <mat-paginator [length]="resultsLength" [pageSize]="30" aria-label=""></mat-paginator>
    </div>
  `
})
export class RegistrosComponent {
  //Ideal que esse Array fosse populado por um group by do banco
  regioes = ['NE', 'N', 'S', 'SE'];
  regiao: BehaviorSubject<string> = new BehaviorSubject(this.regioes[0]);

  colunas: string[] = ['agente', 'data', 'sigla', 'geracao', 'total_geracao', 'compra', 'total_compra'];
  agenteDatabase!: AgenteHttpDatabase | null;
  data: Agente[] = [];

  resultsLength = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _httpClient: HttpClient) { }

  mudarRegiao(event: MatSelectChange) {
    this.regiao.next(event.source.value);
    this.paginator.firstPage();
  }

  ngAfterViewInit() {
    this.agenteDatabase = new AgenteHttpDatabase(this._httpClient);
    this.paginator.firstPage();

    merge(this.paginator.page, this.regiao)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.agenteDatabase!.getItems(this.regiao.getValue(), this.paginator?.pageIndex).pipe(catchError(() => of(null)));
        }),
        map(data => {

          if (data === null) {
            return [];
          }

          this.resultsLength = data.totalElements;
          return data.content;
        }),
      )
      .subscribe(data => (this.data = data));
  }
}

export class AgenteHttpDatabase {
  constructor(private _httpClient: HttpClient) { }

  getItems(regiao: string, page: number): Observable<AgenteApi> {
    const href = 'http://localhost:8080';
    const requestUrl = `${href}/registros/${regiao}?page=${page + 1}`;
    return this._httpClient.get<AgenteApi>(requestUrl);
  }
}

export interface AgenteApi {
  content: Agente[];
  totalElements: number;
}

export interface Agente {
  codigoAgente: string;
  data: Date;
  siglaRegiao: string;
  geracao: any[];
  compra: any[];
  precoMedio: any[]
}