import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef,OnChanges} from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit,AfterViewInit,OnChanges {

  @ViewChild('canvas',{static: false})
  ref: ElementRef;

  @Input() width: number;
  @Input() height: number;

  private context: CanvasRenderingContext2D;
  private chart: Chart;
  private color = [ 'rgba(255,99,132,1)' ];
  private label = "label";
  private data = [12, 19, 3, 5, 2, 3];
  private labels = ["12", "19", "3", "5", "2", "3"];

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(){
    this.chart.update();
  }
  
  ngAfterViewInit() {
    // canvasを取得
    this.context = this.ref.nativeElement.getContext('2d');
    this.context.canvas.height = window.innerHeight / 6;
    let data:Chart.ChartData = {
      labels: this.labels,
      datasets: [{
        label: this.label,
        data: this.data,
        backgroundColor: [
            'rgba(255, 255, 255, 0.2)',
        ],
        borderColor: this.color,
        borderWidth: 1,
        
      }]
    };
    
    Chart.defaults.global.defaultFontColor = 'black';
    this.chart = new Chart(this.context, {
      type: 'line',
      data: data,
    });
  }

}

