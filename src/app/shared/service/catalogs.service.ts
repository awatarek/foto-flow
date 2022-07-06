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

    public async editCatalog(data): Promise<void>{
        await this.http.post(this.url+"catalog/edit", data).toPromise();
    }

    public async getCatalogs(): Promise<Catalog[]>{
        return await this.http.get<Catalog[]>(this.url+"catalogs").toPromise();
    }

    public async getAllCatalogs(): Promise<Catalog[]>{
        return await this.http.get<Catalog[]>(this.url+"catalogs/all").toPromise();
    }

    public async getFirstCatalogsPhoto(): Promise<Photo[]>{
        return await this.http.get<Photo[]>(this.url+"catalogs/photos").toPromise();
    }

    public async setVisibleCatalog(catalogId: number, isTrue: boolean){
        await this.http.post(this.url+"catalog/visible/"+catalogId, {"isTrue": `${isTrue}`}).toPromise();
    }

    public async setAcceptedCatalog(catalogId: number, isTrue: boolean){
        await this.http.post(this.url+"catalog/accepted/"+catalogId, {"isTrue": `${isTrue}`}).toPromise();
    }

    public async createCatalog(formData: FormData){
        return this.http.post(this.url+"catalog/create", formData, {
            reportProgress: true,
            responseType: 'json',
            observe: "events"
        });
    }

    public async addPhotoToCatalog(formData: FormData){
        return this.http.post(this.url+"catalog/add", formData, {
            reportProgress: true,
            observe: "events",
            responseType: 'json',
        });
    }

    public async getPhotosFromCatalog(catalogID: number){
        return await this.http.get<Photo[]>(this.url+"catalog/"+catalogID).toPromise()
    }

    public async getCatalogDetails(catalogID: number): Promise<any>{
        return await this.http.get<Catalog>(this.url+"catalog/details/"+catalogID).toPromise();
    }

    public async editPhoto(formData: any){
        return this.http.post(this.url+"photo/edit", formData).toPromise();
    }

    public async getAllPhotos(){
        return await this.http.get<Photo[]>(this.url+"photo/all").toPromise();
    }

    public async getPhoto(id: number): Promise<Blob>{
        return await this.http.get(this.url+"photo/full", { responseType: 'blob', params: {id: id} }).toPromise()
    }

    public async getMiniPhoto(id: number): Promise<Blob>{
        return await this.http.get(this.url+"photo/mini", { responseType: 'blob', params: {id: id} }).toPromise()
    }

    public async removePhoto(name: string, catalog: number, photoId: number){
        await this.http.post(this.url+"photo/remove", {"name": `${name}`, "catalog": `${catalog}`, "photoId": `${photoId}`}).toPromise();
    }

    public async getNotActivePhoto(){
        return await this.http.get<Photo[]>(this.url+"photo/verify").toPromise()
    }

    public async setVisiblePhoto(photoId: number, isTrue: boolean){
        await this.http.post(this.url+"photo/visible/"+photoId, {"isTrue": `${isTrue}`}).toPromise();
    }

    public async setAcceptedPhoto(photoId: number, isTrue: boolean){
        await this.http.post(this.url+"photo/accepted/"+photoId, {"isTrue": `${isTrue}`}).toPromise();
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

        return this.http.get(this.url+"photo/multiple", 
        {responseType: 'blob',reportProgress: true, observe: "events", params: params});
    }

    public async getPhotoDetails(id: number): Promise<Photo>{
        return await this.http.get<Photo>(this.url+"photo/details", { params: {id: id} }).toPromise()
    }

    public async getTags(){
        return await this.http.get<{data: string, label: string, type: number}[]>(this.url+"tags").toPromise()
    }

    public async getPhotoWithNoTags(){
        return await this.http.get<Photo[]>(this.url+"photo/noTag").toPromise()
    }

    public async getSearchPhoto(data: any){
        return await this.http.post<Photo[]>(this.url+"photo/search", {data}).toPromise();
    }
}