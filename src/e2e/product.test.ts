import { IProduct } from "@core/models/entities/product.model";
import { ApiHttpClient } from "../utils/api-http-client";
import { IProductCategory } from "@core/models/entities/product-category.model";

describe('Product', () => {
    let endpoint = "product"
    let response;
    let product: IProduct = {
        name: "Book x",
        price: 10,
        description: "A book",
        productCategoryId: null
    };


    beforeEach(async () => {
        await ApiHttpClient.instance.get("seed/reset");
    })

    describe('createOne', () => {
        test('should create a new product', async () => {
            response = await ApiHttpClient.instance.post(endpoint, product);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...product,
                id: 1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        });

        test('should create a new product with category', async () => {
            const category: IProductCategory = { name: "Books" };
            response = await ApiHttpClient.instance.post("product-category", category);
            response = await ApiHttpClient.instance.post(endpoint, { ...product, productCategoryId: 1 });
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...product,
                id: 1,
                productCategoryId: 1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        });
    });

    describe('getOneById', () => {
        test(`should return the product with id 1`, async () => {
            response = await ApiHttpClient.instance.post(endpoint, product);
            response = await ApiHttpClient.instance.get<IProduct>(endpoint + "/1");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...product,
                id: 1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        });

        test(`should return null because because id 0 not found`, async () => {
            const response = await ApiHttpClient.instance.get<IProduct>(endpoint + "/0");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual(null);
        });

        test(`should return null because id 2 not found`, async () => {
            const response = await ApiHttpClient.instance.get<IProduct>(endpoint + "/2");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual(null);
        });
    });

    describe('getProductsFromCategory', () => {
        test(`should return products from specific category`, async () => {
            const category: IProductCategory = { name: "Books" };
            response = await ApiHttpClient.instance.post("product-category", category);
            response = await ApiHttpClient.instance.post(endpoint, { ...product, productCategoryId: 1 });
            response = await ApiHttpClient.instance.get<IProduct[]>(endpoint + "/category/" + category.name);

            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data.length).toBe(1);
            expect(response.data).toEqual([
                {
                    ...product,
                    id: 1,
                    productCategoryId: 1,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            ]);
        });
    });

    describe('getAll', () => {
        test(`should return all products`, async () => {
            response = await ApiHttpClient.instance.post(endpoint, product);
            response = await ApiHttpClient.instance.get<IProduct[]>(endpoint);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data.length).toBe(1);
            expect(response.data).toEqual([
                {
                    ...product,
                    id: 1,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            ]);
        });
    });

    describe('updateOne', () => {
        test(`should update product name to Book y`, async () => {
            const name = "Book y";
            response = await ApiHttpClient.instance.post(endpoint, product);
            response = await ApiHttpClient.instance.put<IProduct>(endpoint, { ...response.data, id: 1, name });
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...product,
                id: 1,
                name,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            });
        });
    });

    describe('deleteOneById', () => {
        test('should delete an product by ID', async () => {
            response = await ApiHttpClient.instance.post(endpoint, product);
            response = await ApiHttpClient.instance.delete(endpoint + "/1");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual(1);
        });
    });
});