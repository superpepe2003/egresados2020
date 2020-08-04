import { Component, OnInit, Input } from '@angular/core';
import { IUsuario } from '../../../models/usuario';
import { ChartType, ChartOptions } from 'chart.js';
import { totalmem } from 'os';

@Component({
  selector: 'app-grafico-alumno',
  templateUrl: './grafico-alumno.component.html',
  styleUrls: ['./grafico-alumno.component.scss'],
})
export class GraficoAlumnoComponent implements OnInit {

  //@Input() Alumnos: IUsuario[] = [];

  // Datos
  public expPadres: number[] = [];
  public hermanosViajaron: number[] = [];
  public refBaxtter: number[] = [];

  public expPadresLabel: string[] = ['Si', 'No'];
  public hermanosViajaronLabel: string[] = ['Travel Rock', 'Baxtter', 'Max Dream', 'Otras'];
  public refBaxtterLabel: string[] = ['Si', 'No'];



  public doughnutChartType: ChartType = 'doughnut';
  pieChartLegend = true;

  pieChartColorsEmpresas = [
    {
      backgroundColor: ['rgba(255, 150, 50, 0.7)', 'rgba(255, 0, 0,0.7)', 'rgba(0,255,255, 0.7)',
                        'rgba(120, 120, 120, 0.7)'],
    },
  ];
  pieChartColors = [
    {
      backgroundColor: ['rgba(255, 0, 0,0.7)',  'rgba(0,255,255, 0.7)' ],
    },
  ];

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };

  constructor() { }

  ngOnInit() {}

  cargarEstados( Alumnos: IUsuario[] ){

    // variable para cargar los datos
    let exp = 0;
    let ref = 0;
    const empresas = [0, 0, 0, 0];

    // recorro el alumno para sacar los datos
    Alumnos.forEach( resp => {

      if ( resp.experiencia.toString() === 'true' ){
        exp ++;
        console.log('exp: ', exp);
      }
      if ( resp.referencia.toString() === 'true' ) {
        ref ++;
      }

      // recorro las empresas para cargar los datos
      if ( resp.empresas ){

        resp.empresas.forEach( c => {
          switch ( c ){
            case 'Travel Rock':
              empresas[0]++;
              break;
            case 'Baxtter':
              empresas[1]++;
              break;
            case 'Max Dream':
              empresas[2]++;
              break;
            case 'Otras':
              empresas[3]++;
              break;
          }
        });
      }


    });

    const porceExp = exp * 100 / Alumnos.length;
    const porceRef = ref * 100 / Alumnos.length;

    const totalEmpresas = empresas[0] + empresas[1] + empresas[2] + empresas[3];
    // Cargo los datos
    this.expPadres.push( Number(porceExp.toFixed(2)) );
    this.expPadres.push( Number((100 - porceExp).toFixed(2)) );

    this.refBaxtter.push( Number(porceRef.toFixed(2)) );
    this.refBaxtter.push( Number((100 - porceRef).toFixed(2)) );

    this.hermanosViajaron.push( empresas[0] * 100 / totalEmpresas );
    this.hermanosViajaron.push( empresas[1] * 100 / totalEmpresas);
    this.hermanosViajaron.push( empresas[2] * 100 / totalEmpresas);
    this.hermanosViajaron.push( empresas[3] * 100 / totalEmpresas);

  }

}
