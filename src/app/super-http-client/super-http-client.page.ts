import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../services/network.service';
import { SuperHttpClientService, ICachingOptions } from '../services/super-http-client.service';

@Component({
  selector: 'app-super-http-client',
  templateUrl: './super-http-client.page.html',
  styleUrls: ['./super-http-client.page.scss'],
})
export class SuperHttpClientPage implements OnInit {

  constructor(private ntwService: NetworkService, private superHttp: SuperHttpClientService) {
    this.ntwService.onNetworkChange().subscribe((network) => {
      console.log(network);
    });
  }

  ngOnInit() {
  }

  get(){
    let caching:ICachingOptions={
      caching:false,
      key:'rama',
    };

    this.superHttp.Get(
     'https://www.reddit.com/r/Cyberpunk/comments/c9g3l8/building_a_new_pc_very_soon_so_i_drew_a_cyberpunk.json',
     false,
     caching
    ).then((res)=>{
      console.log(res);
    })
  }

  setOnline(){
    this.ntwService.setOnline();
  }

  setOffline(){
    this.ntwService.setOffline();
  }

}
