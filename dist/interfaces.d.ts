export interface Metric {
    id: string;
    count: number;
}
export interface ViewsAndDurationsForDomainId {
    durations: Metric[];
    title: string;
    views: Metric[];
}
export interface SizesForDomainId {
    sizes: Metric[];
    title: string;
}
export interface Facts {
    activeVisitors: number;
    averageDuration: number;
    averageViews: number;
    viewsToday: number;
    viewsMonth: number;
    viewsYear: number;
}
