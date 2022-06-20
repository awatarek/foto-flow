import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Catalog } from "../model/catalog.model";
import { CatalogAdd } from "../model/catalogAdd.model";
import { Photo } from "../model/photo.model";

@Injectable({
    providedIn: 'root',
})
export class CatalogsService {
    public url: string = environment.API_URL;

    constructor(private http: HttpClient){}

    public async getCatalogs(): Promise<Catalog[]>{
        return await this.http.get<Catalog[]>(this.url+"catalogs").toPromise();
    }

    public async getFirstCatalogsPhoto(): Promise<Photo[]>{
        return await this.http.get<Photo[]>(this.url+"catalogs/photos").toPromise();
    }

    public async createCatalog(formData: FormData){
        await this.http.post("http://localhost:4001/api/v1/catalog/create", formData, {
            reportProgress: true,
            responseType: 'json',
        }).toPromise();
    }

    public async addPhotoToCatalog(formData: FormData){
        await this.http.post("http://localhost:4001/api/v1/catalog/add", formData, {
            reportProgress: true,
            responseType: 'json',
        }).toPromise();
    }



    public async getPhotosFromCatalog(catalogID: number){
        return await this.http.get<Photo[]>(this.url+"catalog/"+catalogID).toPromise()
    }
    public async getCatalogDetails(catalogID: number): Promise<any>{
        return await this.http.get<Catalog>(this.url+"catalog/details/"+catalogID).toPromise();
    }



    public async getPhoto(id: number): Promise<Blob>{
        return await this.http.get(this.url+"photo", { responseType: 'blob', params: {id: id} }).toPromise()
    }

    public async getMiniPhoto(id: number): Promise<Blob>{
        return await this.http.get(this.url+"photo/mini", { responseType: 'blob', params: {id: id} }).toPromise()
    }

    public async downloadMultiplePhoto(photos: Photo[], catalog: number){
        let params = new HttpParams();
        for(let item of photos){
            params = params.append('id', item.id)
        }
        if(photos.length == 0){
            params = params.append('all', true)
        }
        params = params.append('catalog', catalog)
        return await this.http.get(this.url+"photo/multiple", {responseType: 'blob', params: params}).toPromise();
    }

    public async getPhotoDetails(id: number): Promise<Photo>{
        return await this.http.get<Photo>(this.url+"photo/details", { params: {id: id} }).toPromise()
    }
}