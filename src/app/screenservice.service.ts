import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ScreenModel } from './pages/screenmodel';

@Injectable({
  providedIn: 'root'
})

export class ScreenserviceService {
  screen_list=[];

  constructor(private http:HttpClient) {
    //this.getScreens();
   }
  
  rootURL = '/pos';
  getScreens(){
    var resp= this.http.get(this.rootURL + '/allscreens',{responseType: 'text'});
      return resp;
  }
  

}
