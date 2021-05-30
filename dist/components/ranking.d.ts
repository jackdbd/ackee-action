import { Metric } from '../interfaces';
interface Props {
    delimiter?: string;
    domain: string;
    isLink?: boolean;
    metrics: Metric[];
    thing: string;
}
export declare const ranking: ({ delimiter, isLink, metrics, domain, thing }: Props) => string;
export {};
