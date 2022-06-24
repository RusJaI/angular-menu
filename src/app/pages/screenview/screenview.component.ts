import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { bindCallback } from 'rxjs';
import { PosserviceService } from 'src/app/posservice.service';
import { ScreenModel } from '../screenmodel';
import { NgxCaptureService } from 'ngx-capture';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';

declare var start: any,castContent:any;
@Component({
  selector: 'app-screenview',
  templateUrl: './screenview.component.html',
  styleUrls: ['./screenview.component.css']
})


export class ScreenviewComponent implements OnInit{
  @ViewChild('screen', { static: true }) screen: any;
  backgroundcolor;
  textcolor;
  screenwidth;
  aspectratio;
  screenheight;
  productsList:any[]=[];
  content:any[];
  imgBase64:any='';
  @Input() tablestyle:any;
  @Input() screendata_map:Map<number,ScreenModel>;
  constructor(posService:PosserviceService,private route: ActivatedRoute,private captureService:NgxCaptureService,private httpclient: HttpClient) { 

   /* posService.getAllProducts().subscribe((prd:any[]) =>{
      this.productsList=prd;
    });*/

    //console.log("##input : ",this.name);

   }
  async ngOnInit() {
    new start();
    await this.route.paramMap.subscribe( params =>{
      //this.tablestyle=params.get('tablestyle');
      console.log("ttt",this.tablestyle);
      this.backgroundcolor=this.tablestyle.bgcolor;
      if(this.backgroundcolor=="white"){
        this.textcolor="black";
      }else{
        this.textcolor="white";
      }
      this.screenwidth=600;
      this.aspectratio=this.tablestyle.screen_height/this.tablestyle.screen_width;
      this.screenheight=this.aspectratio*600;
      this.screenheight=this.screenheight+"px";

      if(this.tablestyle.screen_height>this.tablestyle.screen_width){
        this.screenheight=600;
        this.aspectratio=this.tablestyle.screen_width/this.tablestyle.screen_height;
        this.screenwidth=this.aspectratio*600;
        this.screenwidth=this.screenwidth+"px";
      }
    
      console.log("#dimensions : ",this.screenheight,this.screenwidth);
 
    }
   );
  }

  buttonAction(){
    this.capture();
    console.log("button funvtion");
    new castContent();
  }

  capture(){ 
    this.captureService.getImage(this.screen.nativeElement, true).subscribe(img=>{
      console.log("#image : ",img);
      this.imgBase64=img;
      this.saveFile();
    })
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]
        
    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)
      
        return new Blob([ia], { type: mimeString })
  }

  saveFile() {
    const file = this.DataURIToBlob(this.imgBase64);
    //saveAs(file, '/assets/screens/hello.png');
    saveAs(file, `../../../assets/screens/${this.tablestyle.id}.png`);
  }
}
