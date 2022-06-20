export class Photo{
    public id: number;
    public name: string;
    public fileLocation: string;
    public tags?: string;
    public location?: string;
    public author?: string;
    public creation_day?: Date;
    public upload_day: Date;
    public catalogs_id: number;
    public accepted?: boolean;
    public visible?: boolean;
}