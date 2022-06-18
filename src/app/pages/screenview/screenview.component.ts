import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { bindCallback } from 'rxjs';
import { PosserviceService } from 'src/app/posservice.service';
import { ScreenModel } from '../screenmodel';

declare var start: any,castContent:any;
@Component({
  selector: 'app-screenview',
  templateUrl: './screenview.component.html',
  styleUrls: ['./screenview.component.css']
})


export class ScreenviewComponent implements OnInit{
  backgroundcolor;
  textcolor;
  screenwidth;
  aspectratio;
  screenheight;
  productsList:any[]=[];
  content:any[];
  @Input() tablestyle:any;
  @Input() categoryList:any;
  @Input() screendata_map:Map<number,ScreenModel>;
  constructor(posService:PosserviceService,private route: ActivatedRoute) { 

    posService.getAllProducts().subscribe((prd:any[]) =>{
      this.productsList=prd;
    });

    //console.log("##input : ",this.name);

   }
  async ngOnInit() {
    new start();
    await this.route.paramMap.subscribe( params =>{
      //this.tablestyle=params.get('tablestyle');
      console.log("ttt",this.tablestyle);
      console.log("#tabledata",this.categoryList);
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

      this.content=this.screendata_map.get(this.tablestyle.id).content;
      console.log("screen data  : ",this.content);
    }
   );
  }

  buttonAction(){
    console.log("button funvtion");
    new castContent();
  }

}
