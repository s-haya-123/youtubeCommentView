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

  // @Input()
  // data: ChartData;

  // @Input()
  // options: ChartOptions;

  // @Input() labels: string[];
  // @Input() datas: object[];
  // @Input() yAxes:object[];
  isBeginzeros:boolean = false;

  context: CanvasRenderingContext2D;
  chart: Chart;
  selectIndex:number = 0;
  colorList = ['rgb(223, 215, 0)','rgb(255, 163, 0)','rgb(255, 163, 255 )'];

  constructor() { }

  ngOnInit() {
    this.initDate();
  }
  ngOnChanges(){
    // this.data.labels = this.labels;
    
    this.chart.update();
  }
  
  private initDate(){
    // this.data = {
    //   labels: this.labels,
    //   datasets: [{
    //     label: 'humidity',
    //     data: [],
    //     borderColor: this.colorList[0],
    //     lineTension: 0, //<===追加
    //     fill: false,    //<===追加
    //   },
    //   {
    //     label: 'temperature',
    //     data: [],
    //     borderColor: this.colorList[1],
    //     lineTension: 0, //<===追加
    //     fill: false,    //<===追加
    //   }]
    // };

    // this.options = {
    //   scales: {
    //     yAxes: this.yAxes
    //   },
    //   responsive: true
    // };
  }
 
  ngAfterViewInit() {
    // canvasを取得
    this.context = this.ref.nativeElement.getContext('2d');
    this.context.canvas.height = window.innerHeight / 5;
    let data = {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    };
    // チャートの作成
    Chart.defaults.global.defaultFontColor = 'white';
    this.chart = new Chart(this.context, {
      type: 'line',
      data: data,      // データをプロパティとして渡す
      options: this.options, // オプションをプロパティとして渡す
    });
  }

  setDateOnGraph(index:number){
    this.selectIndex = index;
    this.chart.update();
  }
  isActive(index:number){
    return this.selectIndex == index;
  }

}

