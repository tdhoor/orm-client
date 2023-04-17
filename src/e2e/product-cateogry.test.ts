import { IProductCategory } from "@core/models/entities/product-category.model";
import { ApiHttpClient } from "../utils/api-http-client";

describe('Product Category', () => {
    let endpoint = "product-category"
    let response;
    let category: IProductCategory = {
        name: "books"
    }

    beforeEach(async () => {
        await ApiHttpClient.instance.get("seed/reset");
    })

    describe('createOne', () => {
        test('should create a new product-category', async () => {
            response = await ApiHttpClient.instance.post(endpoint, category);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...category,
                id: 1
            });
        });
    });

    describe('getOneById', () => {
        test(`should return the product-category with id 1`, async () => {
            response = await ApiHttpClient.instance.post(endpoint, category);
            response = await ApiHttpClient.instance.get<IProductCategory>(endpoint + "/1");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...category,
                id: 1
            });
        });

        test(`should return null because because id 0 not found`, async () => {
            const response = await ApiHttpClient.instance.get<IProductCategory>(endpoint + "/0");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual(null);
        });

        test(`should return null because id 2 not found`, async () => {
            const response = await ApiHttpClient.instance.get<IProductCategory>(endpoint + "/2");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual(null);
        });
    });

    describe('getAll', () => {
        test(`should return all product-categories (1)`, async () => {
            response = await ApiHttpClient.instance.post(endpoint, category);
            response = await ApiHttpClient.instance.get<IProductCategory[]>(endpoint);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data.length).toBe(1);
            expect(response.data).toEqual([{
                ...category,
                id: 1
            }]);
        });
    });

    describe('updateOne', () => {
        test(`should update product-category name to Games`, async () => {
            const name = "Games";
            response = await ApiHttpClient.instance.post(endpoint, category);
            response = await ApiHttpClient.instance.put(endpoint, { ...response.data, id: 1, name });
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...category,
                id: 1,
                name
            });
        });
    });

    describe('deleteOneById', () => {
        test('should delete an product-category by ID', async () => {
            response = await ApiHttpClient.instance.post(endpoint, category);
            response = await ApiHttpClient.instance.delete(endpoint + "/1");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual(1);
        });
    });
});