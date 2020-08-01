import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ICurso } from '../../../models/curso';

interface IEstados {
  cant: number;
  alumnos: number;
  porcentaje: number;
  nombre: string;
}

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.scss'],
})
export class GraficoComponent{

  public cursosDatosLabel: string[] = [];
  public cursosDatosAlumnos: number[] = [];
  public cursosDatos: number[] = [];
  public pieChartType: ChartType = 'pie';
  public doughnutChartType: ChartType = 'doughnut';
  public polarAreaChartType: ChartType = 'polarArea';
  public pieChartLegend = true;
  pieChartColors = [
    {
      backgroundColor: ['rgba(209, 12, 12,0.3)', 'rgba(233, 77, 124,0.3)', 'rgba(0,0,255,0.3)',
                        'rgba(238, 3, 199,0.3)', 'rgba(62, 13, 141,0.3)', 'rgba(0,100,200,0.3)'],
    },
  ];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
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


  cursos: ICurso[];
  estados: IEstados[] = [];
  estadosPosibles = [ 'Cargado', 'Iniciado', 'Reu Chicos', 'Reu Padres', 'Definicion', 'Cerrado' ];
  total = 0;

  cargarEstados( cursos ){
    this.cursos = cursos;
    this.cursosDatos = [];
    this.cursosDatosLabel = [];
    this.estados = [];
    this.total = 0;
    for ( let i = 0; i <= 5 ; i++) {
      const temporal = this.cursos.filter( r => r.estado === i);
      const temp = {} as IEstados;

      temp.cant = temporal.length;
      temp.porcentaje = temp.cant / this.cursos.length * 100;
      temp.alumnos = 0;
      temp.nombre = this.estadosPosibles[i];

      temporal.forEach( a => temp.alumnos += a.cant);
      this.estados.push({...temp});
    }

    this.estados.forEach( resp => {
      if ( resp.cant > 0){
        this.cursosDatosLabel.push( resp.nombre );
        this.cursosDatos.push( resp.porcentaje );
        this.cursosDatosAlumnos.push( resp.alumnos );
      }
    });

  }

  chartHovered( e ){
    console.log('chartHovered');
  }

  chartClicked( e ){
    console.log('chartClicked');
  }

}
