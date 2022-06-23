export class Photo{
    public id: number;
    public name: string;
    public tags?: string;
    public location?: string;
    public author?: string;
    public upload_day: Date;
    public catalogs_id: number;
    public accepted?: boolean;
    public visible?: boolean;
}