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
  imagewidth
  
  product_id;
  product_name;
  productsList:any[]=[];
  content:any[];
  imgBase64:any='';
  
  screen_list :ScreenModel []=[]
  categoryList:any[]=[];
  screendata_map=new Map();
  currentYear = new Date().getFullYear();
  allitemsList=[];
  itemsforthisscreen=[];

  @Input() tablestyle:any;
  constructor(private screenService:ScreenserviceService,private posService:PosserviceService,private route: ActivatedRoute,private captureService:NgxCaptureService,private httpclient: HttpClient) { 
    screenService.getScreens().subscribe((scrn:ScreenModel[]) =>{
      this.screen_list=scrn;
    });

    posService.getSelectedCategories().subscribe((ctg:any[]) =>{
      this.categoryList=ctg;
    });
    
    this.posService.getAllProductsRequest().pipe().subscribe((items:any) => {
      var arr=this.posService.processJson(items);
      arr.forEach(item=>{
        this.allitemsList.push(item);
      })
      console.log("Alll : ",this.allitemsList);
      this.distributeData();
      
      this.itemsforthisscreen=this.screendata_map.get(this.tablestyle.id);
      console.log("map : ",this.itemsforthisscreen);
    });
   }

  async ngOnInit() {
    new start();
    await this.route.paramMap.subscribe( params =>{
      //this.tablestyle=params.get('tablestyle');
      console.log("screenview:tablestyle",this.tablestyle);
      this.screen_id=this.tablestyle.id;
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
      this.screentype=this.tablestyle.type;
     // this.product_id=productdata['productId'];
      //this.product_name=productdata.productName;
      console.log("#screenview:table dimensions : ",this.screenheight,this.screenwidth);
      this.imagewidth=this.screenwidth*0.95;
    }
   );
  }

  buttonAction(){
    this.capture();
    console.log("button function");
    new castContent(this.tablestyle.id+'');
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
    var filename= `${this.tablestyle.id}.png`;
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
      console.log("In distribute data :",scrn.id);
      if(scrn.type=="menu"){
        console.log("In distribute data menu :",scrn.id);
        sflag=true;
        while(sflag){ 
          cat_id=this.getCategoryId(cflag);
          cat_items= this.getCategoryItems(cat_id);
          item_count=cat_items.length;
          console.log("distribute data:catitemcount,iflag",item_count,cat_items);
          
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
    console.log("distribute data map :",this.screendata_map);
  }

  getCategoryId(cflag){
    var id= this.categoryList[cflag].productCategoryId;
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
    var res=this.categoryList[cflag].flagged;
    return res;
  }

  setScreenDisplayContent(scrn_id,content:any[]) {
    this.screendata_map.set(scrn_id,content);
  }

}
