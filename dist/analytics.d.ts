import { Facts, Metric, SizesForDomainId, ViewsAndDurationsForDomainId } from './interfaces';
declare type Thunk<T> = () => Promise<T>;
interface Domain {
    id: string;
    title: string;
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
    dailyUniqueViewsAndDurations: Thunk<ViewsAndDurationsForDomainId>;
    domains: Thunk<Domain[]>;
    events: Thunk<Event[]>;
    facts: Thunk<Facts>;
    resultFromQuery?: Thunk<string>;
    topPages: Thunk<Metric[]>;
    topSizesInSixMonths: Thunk<SizesForDomainId>;
};
export declare const NUM_TOP_PAGES = 10;
export declare const makeAnalyticsClient: MakeAnalyticsClient;
export {};
