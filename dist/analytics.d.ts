declare type Thunk<T> = () => Promise<T>;
interface Domain {
    id: string;
    title: string;
}
interface Facts {
    activeVisitors: number;
    averageDuration: number;
    averageViews: number;
    viewsToday: number;
    viewsMonth: number;
    viewsYear: number;
}
interface DomainFacts {
    facts: Facts;
    id: string;
    title: string;
}
interface Metric {
    id: string;
    count: number;
}
interface Event {
    id: string;
    title: string;
    statistics: {
        chart: Metric[];
        list: Metric[];
    };
}
interface AckeeConfig {
    endpoint: string;
    domainId: string;
    numTopPages?: number;
    query?: string;
    token: string;
}
declare type MakeAnalyticsClient = (config: AckeeConfig) => {
    domains: Thunk<Domain[]>;
    domainsFacts: Thunk<DomainFacts[]>;
    events: Thunk<Event[]>;
    facts: Thunk<Facts>;
    resultFromQuery?: Thunk<string>;
    topPages: Thunk<Metric[]>;
};
export declare const NUM_TOP_PAGES = 10;
export declare const makeAnalyticsClient: MakeAnalyticsClient;
export {};
