export interface CriteriaItem {
    id?: any;
    label?: string;
    code?: any;
    parentCode?: any;
    order?: number;
    color?: string;
    image?: string;
    values?: CriteriaItem[];
    isCustom?: boolean;
}
