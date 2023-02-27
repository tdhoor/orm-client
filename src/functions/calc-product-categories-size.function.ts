import { DbSize } from "src/core/db-size";

export function calcProductCategoriesSize(size: DbSize): number {
    return size % 1000 || 100
}