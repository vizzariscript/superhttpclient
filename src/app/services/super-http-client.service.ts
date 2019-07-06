import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NetworkService } from './network.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: any;
}

export interface ICachingOptions {
  caching: boolean,
  key?: string,
  overwrite?: boolean
}

interface RequestCache {
  url: string,
  type?: string,
  params: any;
  data: any,
  date: Date,
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class SuperHttpClientService {

  constructor(private client: HttpClient, private ntwService: NetworkService, private storage: Storage) {

  }

  /**
 * GET request
 * @param {string} url
 * @param {ICachingOptions} cachingOptions
 * @param {IRequestOptions} options * 
 * 
 * @returns {Promise<Object>}
 */
  public Get(url: string, force = false, cachingOptions: ICachingOptions, options?: IRequestOptions) {
    if (this.ntwService.getCurrentNetworkStatus() && force) {
      return this.client.get(url, options).toPromise().then((res) => {
        if (cachingOptions.caching) {
          this.setCache(cachingOptions.key, res, url, options ? options.params : null);
        }
        return res;
      });
    } else {
      if (cachingOptions.key) {
        return this.getCache(cachingOptions.key);
      } else {
        return Promise.resolve([]);
      }
    }
  }

  private getCache(key: string) {
    return this.storage.get(key);
  }

  private setCache(key: string, data: any, url: string, param?: any) {
    let cache: RequestCache = {
      'url': url,
      'params': param,
      'data': data,
      'date': new Date(),
      'id': null
    };
    this.storage.set(key, cache);


  }
}
