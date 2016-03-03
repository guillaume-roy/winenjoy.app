export interface CriteriaItem {
    id?: any;
    label?: string;
    code?: any;
    order?: number;
    isActive?: boolean;
    color?: string;
    image?: string;
    values?: CriteriaItem[];
}
