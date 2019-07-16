import { Component, AfterViewInit, Input, ViewChild, ElementRef, OnChanges, EventEmitter, Output } from '@angular/core';
import { Chart } from 'chart.js';
import { YoutubeService, YoutubeData, CommentData } from '../youtube.service';

class ChartElemet {
  hidden: boolean;
  _index: number;
}


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit,OnChanges {

  @ViewChild('canvas',{static: false})
  ref: ElementRef;

  @Input() width: number;
  @Input() height: number;
  @Input() id: string;

  @Output()
  chartClickEvent = new EventEmitter<number>();

  private context: CanvasRenderingContext2D;
  private chart: Chart;
  private color = [ 'rgba(255,99,132,1)' ];
  private label = "コメント数";
  private chartDatas:CommentData[];
  messages: string[] = [];
  private messageRange = 30000;
  private targetColor = 'rgba(204,0,51, 0.2)';
  private otherColor = ' rgba(0,0,0, 0.1)';


  constructor(private youtubeService: YoutubeService) { 
    
  }

  ngOnChanges(changes: any){
    if( changes.id && this.id != "") {
      this.youtubeService.getYoutubeCommentBurst(this.id,this.messageRange).subscribe(comments=>{
        this.chartDatas = comments;
        this.drawCanvas();
      });
    }    
  }
  
  ngAfterViewInit() {
    // canvasを取得
  }
  private drawCanvas() {
    this.context = this.ref.nativeElement.getContext('2d');
    let labels = this.chartDatas.map( (chartData: CommentData) => chartData.label );
    let datas = this.chartDatas.map( (chartData: CommentData)=> chartData.commentNumber);
    let backgroudColor = new Array(datas.length).fill(this.otherColor);

    let data:Chart.ChartData = {
      labels: labels,
      datasets: [{
        label: this.label,
        data: datas,
        backgroundColor: backgroudColor,
        hoverBackgroundColor: backgroudColor,
        borderWidth: 1,
      }]
    };
    
    Chart.defaults.global.defaultFontColor = 'black';
    this.chart = new Chart(this.context, {
      type: 'bar',
      data: data,
      options: {
        tooltips: {
          mode: 'nearest'
        },
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: [...datas].sort()[0] - 10
            }
          }]
        },
        onClick:(event,element:ChartElemet[])=>{
          if (element.length > 0){
            let index = element[0]._index;
            let chart = this.chartDatas[index];
            this.messages = this.chartDatas[index].messages;
            this.selectChartData(index);
            this.chartClickEvent.emit(chart.second);
          }
        }
      }
    });
  }
  
  selectChartData(clickIndex:number) {
    let backgroudColors = this.chart.data.datasets[0].backgroundColor;
    if (isStrings(backgroudColors)) {
      this.chart.data.datasets[0].backgroundColor = backgroudColors.map((_, index)=>{
        return index === clickIndex ? this.targetColor : this.otherColor;
      });
      this.chart.update();
    }
    
    function isStrings(arr: string[] | any): arr is string[] {
      return Array.isArray(arr) && typeof arr[0] === 'string';
    }
  }
}

