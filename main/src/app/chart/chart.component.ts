import { getComment } from './../../../../server/index';
import { Component, AfterViewInit, Input, ViewChild, ElementRef, OnChanges, EventEmitter, Output } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js';
import { YoutubeService, YoutubeData, CommentData } from '../youtube.service';

class ChartElemet {
  hidden: boolean;
  _index: number;
}

enum ChartMode {
  burst,
  interval,
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit,OnChanges {
  ChartMode: typeof ChartMode = ChartMode
  @ViewChild('canvas',{static: false})
  ref: ElementRef;

  @Input() width: number;
  @Input() height: number;
  @Input() id: string;

  @Output()
  chartClickEvent = new EventEmitter<number>();

  mode: ChartMode = ChartMode.burst;
  private context: CanvasRenderingContext2D;
  private chart: Chart;
  private COLOR = [ 'rgba(255,99,132,1)' ];
  private LABEL = "コメント数";
  private chartDatas:CommentData[];
  messages: string[] = [];
  private messageRange = 30000;
  private TARGET_COLOR = 'rgba(204,0,51, 0.2)';
  private OTHER_COLOR = ' rgba(0,0,0, 0.1)';


  constructor(private youtubeService: YoutubeService) { 
    
  }

  ngOnChanges(changes: any){
    if( changes.id && this.id != "") {
      this.youtubeService.getYoutubeCommentBurst(this.id,this.messageRange).subscribe(comments=>{
        this.chartDatas = comments;
        this.initCanvas(comments);
      });
    }
  }
  
  ngAfterViewInit() {
    // canvasを取得
  }
  private createChartData(chartDatas: CommentData[]): [Chart.ChartData,number] {
    let labels = chartDatas.map( (chartData: CommentData) => chartData.label );
    let datas = chartDatas.map( (chartData: CommentData)=> chartData.commentNumber);
    let backgroudColor = new Array(datas.length).fill(this.OTHER_COLOR);
    const minNumber = [...chartDatas].map(v=>v.commentNumber).sort()[0];
    let data = {
      labels: labels,
      datasets: [{
        label: this.LABEL,
        data: datas,
        backgroundColor: backgroudColor,
        hoverBackgroundColor: backgroudColor,
        borderWidth: 1,
      }]
    };
    return [data,minNumber];
  }
  private initCanvas(chartDatas: CommentData[]) {
    this.context = this.ref.nativeElement.getContext('2d');
    const [data,minNumber] = this.createChartData(chartDatas);
    
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
              suggestedMin: minNumber - 10
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
        return index === clickIndex ? this.TARGET_COLOR : this.OTHER_COLOR;
      });
      this.chart.update();
    }
    
    function isStrings(arr: string[] | any): arr is string[] {
      return Array.isArray(arr) && typeof arr[0] === 'string';
    }
  }
}
