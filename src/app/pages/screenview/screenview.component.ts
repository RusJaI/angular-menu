import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { bindCallback } from 'rxjs';
import { PosserviceService } from 'src/app/posservice.service';
import { ScreenModel } from '../screenmodel';
import { NgxCaptureService } from 'ngx-capture';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ScreenserviceService } from 'src/app/screenservice.service';

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
  screen_id;
  screenheight;
  screentype;
  displayimage;
  imagewidth
  
  product_id;
  product_name;
  productsList:any[]=[];
  content:any[];
  imgBase64:any='';
  previous_catg;
  current_catg
  
  screen_list :ScreenModel []=[]
  categoryList:any[]=[];
  screendata_map=new Map();
  currentYear = new Date().getFullYear();
  allitemsList=[];
  itemsforthisscreen=[];

  @Input() tablestyle:any;
  constructor(private screenService:ScreenserviceService,private posService:PosserviceService,private route: ActivatedRoute,private captureService:NgxCaptureService,private httpclient: HttpClient) { 
   /* screenService.getScreens().subscribe((scrn:ScreenModel[]) =>{
      this.screen_list=scrn;
    });*/
  
    
    screenService.getScreens().pipe().subscribe((scrn) =>{
      var screens=[];
      screens=posService.processDjangoJson(scrn);
      screens.forEach(s=>{
        this.screen_list.push(s);
      })
    }); 

    posService.getSelectedCategories().pipe().subscribe((ctg:any) =>{
      var selectedcategories=[];
      //console.log("selected list : ",catg);
      selectedcategories=this.posService.processDjangoJson(ctg);
      selectedcategories.forEach(item=>{
        this.categoryList.push(item);
      });
      console.log("selected list : ",this.categoryList);
    });

    this.posService.getAllProductsRequest().pipe().subscribe((items:any) => {
      var arr=this.posService.processJson(items);
      arr.forEach(item=>{
        this.allitemsList.push(item);
      })
    
      console.log("Alll : ",this.allitemsList);
      this.distributeData();
      
      this.itemsforthisscreen=this.screendata_map.get(this.tablestyle.tv_id);
      this.previous_catg=this.screendata_map.get(this.tablestyle.tv_id)[0]?.category;
      this.current_catg=""
      console.log("map : ",this.previous_catg,this.itemsforthisscreen);
    });
   }

  async ngOnInit() {
    new start();
    await this.route.paramMap.subscribe( params =>{
      //this.tablestyle=params.get('tablestyle');
      console.log("screenview:tablestyle",this.tablestyle);
      this.screen_id=this.tablestyle.tv_id;
      this.backgroundcolor=this.tablestyle.screen_bgcolor;
      if(this.backgroundcolor=="white"){
        this.textcolor="black";
      }else{
        this.textcolor="white";
      }
      this.screenwidth=609.5;
      this.aspectratio=this.tablestyle.screen_height/this.tablestyle.screen_width;
      this.screenheight=this.aspectratio*609.5;
      

      if(this.tablestyle.screen_height>this.tablestyle.screen_width){
        this.screenheight=609.5;
        this.aspectratio=this.tablestyle.screen_width/this.tablestyle.screen_height;
        this.screenwidth=this.aspectratio*609.5;
        
      }
      this.screentype=this.tablestyle.content_type;
      this.displayimage="../../../../../pos/media/"+this.tablestyle.media_file;

      console.log("#screenview:table dimensions : ",this.screenheight,this.screenwidth);
      this.imagewidth=this.screenwidth*0.85;
      this.screenheight=this.screenheight+"px";
      this.screenwidth=this.screenwidth+"px";
      this.imagewidth=this.imagewidth+"px";
    }
   );
  }

  buttonAction(){
    this.capture();
    console.log("button function");
    new castContent(this.tablestyle.tv_id+'');
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
    var filename= `${this.tablestyle.tv_id}.png`;
    saveAs(file, filename);

    let formData:FormData = new FormData();  
    formData.append("image", file);
    formData.append("name",filename);
    var rootURL = '/pos';
    var req= this.httpclient.post(rootURL + '/saveimage',formData,{responseType: 'blob'});
    req.subscribe(s=>{
      console.log("req : ",s);      
    })
  }

  distributeData(){
    var cflag=0;//category flag
    var iflag=0;//item flag
    var sflag=true;//space flag
    var maxrows=12;
    var cat_id,cat_items:any[]=[],item_count=0,display_count,ifflagged=false;
    this.screen_list.forEach(scrn=>{
      console.log("In distribute data :",scrn.tv_id);
      if(scrn.content_type=="Menu"){
        console.log("In distribute data Menu :",scrn.tv_id);
        sflag=true;
        while(sflag){ 
          cat_id=this.getCategoryId(cflag);
          cat_items= this.getCategoryItems(cat_id);
          item_count=cat_items.length;
          console.log("distribute data:catitemcount,iflag",item_count,cat_items);
          
          if((item_count-iflag)<maxrows){//less than screen size
            display_count=iflag+(item_count-iflag)
            this.setScreenDisplayContent(scrn.tv_id,cat_items.slice(iflag,display_count));
            cflag++;
            iflag=0;
            sflag=true;
          }else if((item_count-iflag)==maxrows){//fit to screen
            display_count=maxrows+iflag;
            this.setScreenDisplayContent(scrn.tv_id,cat_items.slice(iflag,display_count));
            cflag++;
            iflag=0;
            sflag=false;
          }else if((item_count-iflag)>maxrows){//more than screen
            display_count=maxrows+iflag;
            this.setScreenDisplayContent(scrn.tv_id,cat_items.slice(iflag,display_count));
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
    console.log("distribute data map :",this.screendata_map);
  }

  getCategoryId(cflag){
    var id= this.categoryList[cflag].Category;
    console.log("appComponents:getCategoryId() :",id);
    return id;
  }

  getCategoryItems(cat_id){
    var categoryitems=[];
    this.allitemsList.forEach(element => {
      if(element.categoryId==cat_id){
        categoryitems.push(element);
      }
    });
    console.log("distribute data:items for category",categoryitems);
    return categoryitems;
  }

  getItemsCount(cat_id){
    var cnt=[];
    this.posService.getCountForCategory(cat_id).subscribe((c) =>{
      cnt=c;
    });
    console.log("#appcompponent:count for given category:",cnt);
    return cnt;
  }

  ifCategoryFlagged(cflag: number): boolean {
    var res=this.categoryList[cflag].Flag;
    return res;
  }

  setScreenDisplayContent(tv_id,content:any[]) {
    this.screendata_map.set(tv_id,content);
  }

}
