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
  private messageRange = 60000;


  constructor(private youtubeService: YoutubeService) { 
    
  }

  ngOnChanges(changes: any){
    if( changes.id) {
      this.youtubeService.getYoutubeComment(this.id,this.messageRange).subscribe(comments=>{
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
    this.context.canvas.height = window.innerHeight / 6;
    let labels = this.chartDatas.map( (chartData: CommentData) => chartData.label );
    let datas = this.chartDatas.map( (chartData: CommentData)=> chartData.commentNumber);

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
        onClick:(event,element:ChartElemet[])=>{
          if (element.length > 0){
            let index = element[0]._index;
            let chart = this.chartDatas[index];
            this.messages = this.chartDatas[index].messages;
            this.chartClickEvent.emit(chart.second);
          }
        }
      }
    });
  }
}

