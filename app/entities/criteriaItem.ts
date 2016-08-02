export interface CriteriaItem {
    id?: any;
    label?: string;
    code?: any;
    type?: string;
    parentId?: string;
    order?: number;
    color?: string;
    image?: string;
    values?: CriteriaItem[];
    isCustom?: boolean;
}
