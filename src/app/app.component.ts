import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ScreenModel } from './pages/screenmodel';
import { PosserviceService } from './posservice.service';
import { ScreenserviceService } from './screenservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  screen_list :ScreenModel []=[]
  categoryList:any[]=[];
  screendata_map=new Map();
  currentYear = new Date().getFullYear();

  constructor(screenService:ScreenserviceService,posService:PosserviceService){

    screenService.getScreens().subscribe((scrn:ScreenModel[]) =>{
      this.screen_list=scrn;
    });

    posService.getSelectedCategories().subscribe((ctg:any[]) =>{
      this.categoryList=ctg;
    });
    
    console.log("Prod : ",this.categoryList);
    this.distributeData();
    console.log('#datamap : ',this.screendata_map);
  }

  distributeData(){
    var cflag=0;//category flag
    var iflag=0;//item flag
    var sflag=true;//space flag
    var maxrows=12;
    var cat_id,cat_items:any[]=[],item_count=0,display_count,ifflagged=false;
    this.screen_list.forEach(scrn=>{
      console.log("In distribute data :",scrn.id);
      if(scrn.type=="menu"){
        sflag=true;
        while(sflag){ 
          cat_id=this.getCategoryId(cflag);
          cat_items=this.getCategoryItems(cat_id);
          item_count=cat_items?.length;

          if((item_count-iflag)<maxrows){//less than screen size
            display_count=iflag+(item_count-iflag)
            this.setScreenDisplayContent(scrn.id,cat_items.slice(iflag,display_count));
            cflag++;
            iflag=0;
            sflag=true;
          }else if((item_count-iflag)==maxrows){//fit to screen
            display_count=maxrows+iflag;
            this.setScreenDisplayContent(scrn.id,cat_items.slice(iflag,display_count));
            cflag++;
            iflag=0;
            sflag=false;
          }else if((item_count-iflag)>maxrows){//more than screen
            display_count=maxrows+iflag;
            this.setScreenDisplayContent(scrn.id,cat_items.slice(iflag,display_count));
            iflag+=maxrows;
            sflag=false;
          }
          ifflagged=this.ifCategoryFlagged(cflag);
          if(ifflagged){
            sflag=false;
          }
        }
      }else{
        //media
      }
    });
  }

  getCategoryId(cflag){
    var id= this.categoryList[cflag].productCategoryId;
    console.log("getCategoryId() :",id);
    return id;
  }

  getCategoryItems(cat_id){
    var itemarr:[];
    
    return itemarr;
  }

  ifCategoryFlagged(cflag: number): boolean {
    var res=this.categoryList[cflag].flagged;
    return res;
  }

  setScreenDisplayContent(scrn_id,content:any[]) {
    console.log("screendata_map : id,content :",scrn_id,content);
    this.screendata_map.set(scrn_id,content);
  }

}




