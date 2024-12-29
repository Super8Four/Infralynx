// src/models/site.ts

export interface Site {
    id: number;
    name: string;
    location: string;
    description?: string;
}

export class SiteModel {
    private sites: Site[] = [];

    public getAllSites(): Site[] {
        return this.sites;
    }

    public getSiteById(id: number): Site | undefined {
        return this.sites.find(site => site.id === id);
    }

    public createSite(site: Site): Site {
        this.sites.push(site);
        return site;
    }
}