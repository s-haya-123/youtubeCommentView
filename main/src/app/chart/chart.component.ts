import { Component, AfterViewInit, Input, ViewChild, ElementRef,OnChanges} from '@angular/core';
import { Chart } from 'chart.js';

class ChartElemet {
  hidden: boolean;
  _index: number;
}
class ChartData {
  commentNumber: number;
  label: string;
  second: number;
  constructor(
    commentNumber: number,
    label: string,
    second: number
    ) {
      this.commentNumber = commentNumber;
      this.label = label;
      this.second = second;
  }
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})


export class ChartComponent implements AfterViewInit,OnChanges {

  @ViewChild('canvas',{static: false})
  ref: ElementRef;

  @Input() width: number;
  @Input() height: number;

  private context: CanvasRenderingContext2D;
  private chart: Chart;
  private color = [ 'rgba(255,99,132,1)' ];
  private label = "コメント数";
  private chartDatas:ChartData[] = [
    new ChartData(12,"0:30",30),
    new ChartData(19,"1:00",60),
    new ChartData(3,"1:30",90),
    new ChartData(5,"2:00",120),
    new ChartData(3,"2:30",150),
  ]

  constructor() { }

  ngOnChanges(){
    this.chart.update();
  }
  
  ngAfterViewInit() {
    // canvasを取得
    this.context = this.ref.nativeElement.getContext('2d');
    this.context.canvas.height = window.innerHeight / 6;
    let labels = this.chartDatas.map( (chartData:ChartData) => chartData.label );
    let datas = this.chartDatas.map( (chartData:ChartData)=> chartData.commentNumber);

    let data:Chart.ChartData = {
      labels: labels,
      datasets: [{
        label: this.label,
        data: datas,
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
      options: {
        tooltips: {
          mode: 'nearest'
        },
        onClick:(event,element:ChartElemet[] | null)=>{
          if (element != null){
            let index = element[0]._index;
            console.log(this.chartDatas[index]);
          }
        }
      }
    });
  }
}

