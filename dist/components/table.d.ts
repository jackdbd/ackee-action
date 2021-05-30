import { Metric } from '../interfaces';
export declare const legend: () => string;
interface Props {
    durations: Metric[];
    views: Metric[];
}
export declare const table: ({ durations, views }: Props) => string;
export {};
