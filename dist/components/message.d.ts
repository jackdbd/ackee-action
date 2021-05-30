import { Facts, Metric, ViewsAndDurationsForDomainId } from '../interfaces';
interface Props {
    facts: Facts;
    tableData: ViewsAndDurationsForDomainId;
    topPages: Metric[];
    topSizes: Metric[];
}
declare type Message = (props: Props) => string;
export declare const message: Message;
export {};
