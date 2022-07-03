import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
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
  styleUrls: ['./screenview.component.css'],
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
  previous_catg="none";
  current_catg;
  ifcatgchanged=true;
  is_firstrow_belongs_to_new_catg=true;
  
  screen_list :ScreenModel []=[]
  categoryList:any[]=[];
  screendata_map=new Map();
  currentYear = new Date().getFullYear();
  allitemsList=[];
  itemsforthisscreen=[];
  screengrams=[];
  widthsclae=600;
  gramMap=new Map();
  tagMap=new Map();
  @Input() tablestyle:any;
  constructor(private ref: ChangeDetectorRef,private screenService:ScreenserviceService,private posService:PosserviceService,private route: ActivatedRoute,private captureService:NgxCaptureService,private httpclient: HttpClient) { 
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
      this.getGramMap();
      this.setTagMap();
      this.distributeData();
      
      this.itemsforthisscreen=this.screendata_map.get(this.tablestyle.tv_id);
      this.screengrams=this.getscreengramsList();
      console.log("screen grams : ",this.screengrams);
      
      this.checkIfVeryFirstItemForCategory();
    });
   }

  async ngOnInit() {
    new start();
    await this.route.paramMap.subscribe( params =>{
      //this.tablestyle=params.get('tablestyle');
      console.log("screenview:tablestyle",this.tablestyle);
      this.screen_id=this.tablestyle.tv_id;
      this.backgroundcolor=this.tablestyle.screen_bgcolor;
      if(this.backgroundcolor=="White"){
        this.textcolor="black";
      }else{
        this.textcolor="white";
      }
      console.log("text color : ",this.backgroundcolor,this.textcolor);
      
      this.screenwidth=this.widthsclae;
      this.aspectratio=this.tablestyle.screen_height/this.tablestyle.screen_width;
      this.screenheight=this.aspectratio*this.widthsclae;
      

      if(this.tablestyle.screen_height>this.tablestyle.screen_width){
        this.screenheight=this.widthsclae;
        this.aspectratio=this.tablestyle.screen_width/this.tablestyle.screen_height;
        this.screenwidth=this.aspectratio*this.widthsclae;
        
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

  enabled = true;  
  cnt=0;
  getFromCharCode(datacatg) {
    //this.current_catg=datacatg;
    console.log("category view : screen , previous , current ",this.tablestyle.tv_id,this.previous_catg,this.current_catg);
   // return this.current_catg;
    this.previous_catg=this.current_catg;

   if(this.cnt%2==0){
    this.ref.detach();
   }else{
    this.ref.reattach();
   }
   this.cnt++;
   return datacatg;
  }

  initialcnt=0;
  setCatg(datacatg){
    console.log("set category : ",this.tablestyle.tv_id,this.previous_catg,this.current_catg);
    this.current_catg=datacatg;
    if(this.current_catg==this.previous_catg){
      this.ifcatgchanged=false;
    }else{
      this.ifcatgchanged=true;
    }

  }

  getscreengramsList(){
    var screenitems=this.screendata_map.get(this.tablestyle.tv_id);
   // console.log("grams each ",screenitems);
    var grmas=[],tempforitem=[];
    var gramstring;
    screenitems?.forEach(item=>{
      gramstring=item.productGrams;
      tempforitem=gramstring.split(',');
      grmas = [ ...tempforitem, ...grmas];
    })
    return  [...new Set(grmas)];
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
    var selectedcatg_count=this.categoryList.length;
    var cat_id,cat_items:any[]=[],item_count=0,display_limit,ifflagged=false,prevbalance;
    this.screen_list.forEach(scrn=>{
      console.log("In distribute data :",scrn.tv_id);
      if(scrn.content_type=="Menu"){
        console.log("In distribute data Menu :",scrn.tv_id);
        sflag=true;
        prevbalance=0;
        while(sflag){
          if(cflag==selectedcatg_count) {
            break;
          }
          cat_id=this.getCategoryId(cflag);
          cat_items= this.getCategoryItems(cat_id);
          item_count=cat_items.length+prevbalance;
          console.log("distribute data:catitemcount,iflag",item_count,cat_items);
          
          if((item_count-iflag)<maxrows){//less than screen size
            display_limit=item_count;
            console.log("before receive : ",iflag," : ",display_limit);
            
            this.setScreenDisplayContent(scrn.tv_id,cat_items.slice(iflag,display_limit));
            prevbalance=display_limit-iflag
            cflag++;
            iflag=0;
            sflag=true;
          }else if((item_count-iflag)==maxrows){//fit to screen
            display_limit=maxrows+iflag;
            this.setScreenDisplayContent(scrn.tv_id,cat_items.slice(iflag,display_limit));
            cflag++;
            iflag=0;
            sflag=false;
            prevbalance=0;
          }else if((item_count-iflag)>maxrows){//more than screen
            display_limit=maxrows+iflag-prevbalance;
            this.setScreenDisplayContent(scrn.tv_id,cat_items.slice(iflag,display_limit));
            iflag=display_limit;
            sflag=false;
            prevbalance=0;
          }
          ifflagged=this.ifCategoryFlagged(cflag);
          if(ifflagged && cflag!=0){
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

  getGramMap(){
    this.allitemsList.forEach(item=>{//all items list have just one gram value
      var itemname=item.productName;
      var prodgram=item.productGrams;
      var price=item.price;
      var submap=new Map();
      var existingsubmap=new Map();
      submap.set(prodgram,price);
      if(this.gramMap.has(itemname)){
        existingsubmap=this.gramMap.get(itemname);
        existingsubmap.set(prodgram,price);
        this.gramMap.set(itemname,existingsubmap);
      }else{
        this.gramMap.set(itemname,submap);
      }
    })
    console.log("gram map : ",this.gramMap);
    
  }

  setTagMap(){
    this.allitemsList.forEach(item=>{//all items list have just one gram value
      var itemname=item.productName;
      var prodtags=item.tags;
      this.tagMap.set(itemname,prodtags);
    })
    console.log("tag map : ",this.tagMap); 
  }

  getTag(prodname){
    var tagstring="";
    var tagarr=[];
    if(this.tagMap.has(prodname)){
      tagarr=this.tagMap.get(prodname);
      if(typeof(tagarr)=="string"||tagarr==null){
        tagarr=[];
      }
      console.log("tag arr view: ",tagarr);
      
      tagarr.forEach(t=>{
        tagstring=tagstring+" , "+t.tagName;
      })
    }else{
    }
    if(tagstring!=""){
      tagstring=tagstring.substring(2);
    }
    return tagstring;
  }
  getCategoryItems(cat_id){
    var categoryitems=[];
    var tempallitems=JSON.parse(JSON.stringify(this.allitemsList));
    tempallitems.sort((a,b) => a.productName.localeCompare(b.productName));
    var namelist=[];
    tempallitems.forEach(element => {
      if(element.categoryId==cat_id){
        if(namelist.includes(element.productName)){
          categoryitems.forEach(item=>{
            if(item.productName==element.productName){//if product already in category list, append the product gram
                item.productGrams=item.productGrams+","+element.productGrams;
            }
          })
          console.log("duplicate : ",element.productName);
          
        }else{
          element.productGrams=element.productGrams.toString();
          categoryitems.push(element);
          namelist.push(element.productName);
        }
      }
    });
    console.log("distribute data:items for category ",cat_id," :",categoryitems);
    return categoryitems;
  }

  getGramPrice(prodName,gram){
    //console.log("go gram ",gram);
    var tempmap=new Map();
    var gramval;
    if(this.gramMap.has(prodName)){
      tempmap=this.gramMap.get(prodName);
      gramval=parseFloat(gram);
      console.log("go gram ",gram," ; ",tempmap.get(gramval));
      if(tempmap.has(gramval)){
        return "$"+tempmap.get(gramval);
      }
      else{
        return '-';
      }
    }else{
      return '-'
    }
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
    var res=this.categoryList[cflag]?.Flag;
    if(res=='True'){
      return true;
    }else{
      return false;
    }
  }

  setScreenDisplayContent(tv_id,content:any[]) {
    console.log("Received : ",tv_id," data :",content);
    
    var cntent=[];
    if(this.screendata_map.has(tv_id)){
      cntent=this.screendata_map.get(tv_id);
    }
    cntent = [ ...cntent, ...content];
    console.log("content : ",cntent);
    
    this.screendata_map.set(tv_id,cntent);
  }

  checkIfVeryFirstItemForCategory(){
    var numscreens=this.screen_list.length;
    var myscreenid=this.tablestyle.tv_id;
    var prevscreenid;
    var prevscreencontent=[];
    if(this.screen_list[0]?.tv_id==myscreenid){
      this.is_firstrow_belongs_to_new_catg=true;
    }else{
      var indexformyscreen;
      for(var i=0;i<numscreens;i++){
        if(this.screen_list[i].tv_id==myscreenid){
          indexformyscreen=i;
          break;
        }
      }
      prevscreenid=this.screen_list[indexformyscreen-1].tv_id;
      var firstcatgofmyscreen=this.screendata_map.get(myscreenid)[0].categoryId;
      prevscreencontent=this.screendata_map.get(prevscreenid);
      var lastcatgofprevscreen=prevscreencontent[prevscreencontent.length-1].categoryId;
      console.log("reveal -- :",firstcatgofmyscreen,lastcatgofprevscreen);
      if(firstcatgofmyscreen==lastcatgofprevscreen){
        this.is_firstrow_belongs_to_new_catg=false;
      }else{
        this.is_firstrow_belongs_to_new_catg=true;
      }
    }
    console.log(" is first row ",this.tablestyle.tv_id,this.is_firstrow_belongs_to_new_catg);
  }
}
