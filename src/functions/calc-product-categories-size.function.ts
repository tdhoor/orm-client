import { DbSize } from "../core/db-size";

export function calcProductCategoriesSize(size: DbSize): number {
    return size % 1000 || 100
}