import { describe, expect, test } from '@jest/globals';
import { ApiHttpClient } from '../utils/api-http-client';
import { createTestData } from '../../libs/core/src/functions/create-test-data.function';
import { IProductCategory } from '@core/models/entities/product-category.model';

describe('CRUD', () => {
    let response;
    let seedAmount = 10;

    let calcId = (i: number) => i + seedAmount + 1;

    beforeEach(async () => {
        await ApiHttpClient.instance.get("seed/" + seedAmount);
    })

    describe('Create', () => {
        test('products', async () => {
            const arr = createTestData.create.products(10);
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                response = await ApiHttpClient.instance.post("product", item);
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                expect(response.data).toEqual({
                    ...item,
                    id: calcId(i),
                    productCategoryId: null,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                });
            }

            response = await ApiHttpClient.instance.get("product");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data.length).toBe(seedAmount + arr.length);
        });

        test('customers with address', async () => {
            const arr = createTestData.create.customersWithAddress(10);
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                response = await ApiHttpClient.instance.post("customer", item);
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                expect(response.data).toEqual({
                    ...item,
                    id: calcId(i),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    address: {
                        ...item.address,
                        id: calcId(i),
                        customerId: calcId(i),
                    }
                });
            }
            response = await ApiHttpClient.instance.get("customer");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data.length).toBe(seedAmount + arr.length);

            response = await ApiHttpClient.instance.get("address");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data.length).toBe(seedAmount + arr.length);
        });

        test('orders', async () => {
            const { orders: arr } = createTestData.create.orders(10, 10, 10);
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                response = await ApiHttpClient.instance.post("order", item);
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");

                expect(response.data).toEqual({
                    ...item,
                    id: calcId(i),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    orderItems: item.orderItems
                        .map((x, oi) => ({
                            ...x,
                            id: expect.any(Number),
                            orderId: calcId(i),
                        }))
                });

                expect([(seedAmount * 2) + (i * 2) + 1, (seedAmount * 2) + (i * 2) + 2]).toContain(response.data.orderItems[0].id);
                expect([(seedAmount * 2) + (i * 2) + 1, (seedAmount * 2) + (i * 2) + 2]).toContain(response.data.orderItems[1].id);
            }
            response = await ApiHttpClient.instance.get("order");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data.length).toBe(seedAmount + arr.length);

            response = await ApiHttpClient.instance.get("order-item");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data.length).toBe(seedAmount * 2 + arr.length * 2);
        });

        test('customers bulk', async () => {
            const arr = createTestData.create.customers(50);
            response = await ApiHttpClient.instance.post("customer/bulk", arr);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");

            response = await ApiHttpClient.instance.get("customer");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data.length).toBe(seedAmount + arr.length);
        });

    });

    describe('Read', () => {
        test('products', async () => {
            const arr = createTestData.read.productIds(10, seedAmount);
            for (let i = 0; i < arr.length; i++) {
                const id = arr[i];
                response = await ApiHttpClient.instance.get("product/" + id);
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                expect(response.data).toEqual({
                    id,
                    name: expect.any(String),
                    description: expect.any(String),
                    price: expect.any(Number),
                    productCategoryId: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                });
            }
        });

        test('products from category name 1', async () => {
            const arr = createTestData.read.categoryNames(10, seedAmount);
            const response2 = await ApiHttpClient.instance.get<IProductCategory[]>("product-category");
            for (let i = 0; i < arr.length; i++) {
                const name = arr[i];
                response = await ApiHttpClient.instance.get("product/category/" + name);
                const category = response2.data.find(c => c.name === name);
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                response.data.forEach((x: any) => {
                    expect(x).toEqual({
                        id: expect.any(Number),
                        name: expect.any(String),
                        description: expect.any(String),
                        price: expect.any(Number),
                        productCategoryId: category.id,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    })
                });
            }
        });

        test('customer ordes', async () => {
            const arr = createTestData.read.orderIds(10, seedAmount);
            for (let i = 0; i < arr.length; i++) {
                const id = arr[i];
                response = await ApiHttpClient.instance.get("customer/" + id + "/orders");
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                response.data.forEach((x: any) => {
                    expect(x).toMatchObject({
                        id: expect.any(Number),
                        customerId: id,
                        totalPrice: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                        orderItems: expect.any(Object),
                    })
                });
            }
        });

        test('customer products', async () => {
            const arr = createTestData.read.productIds(10, seedAmount);
            for (let i = 0; i < arr.length; i++) {
                const id = arr[i];
                response = await ApiHttpClient.instance.get("customer/" + id + "/products");
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                response.data.forEach((x: any) => {
                    expect(x).toEqual({
                        id: expect.any(Number),
                        name: expect.any(String),
                        price: expect.any(Number),
                        description: expect.any(String),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                        productCategoryId: expect.any(Number),
                    })
                });
            }
        });
    });

    describe('Update', () => {
        test('category name', async () => {
            const arr = createTestData.update.productCategories(10, seedAmount);

            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                response = await ApiHttpClient.instance.put("product-category/", item);
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                expect(response.data).toEqual(item);
            }
        });

        test('customer phone', async () => {
            const arr = createTestData.update.customers(10, seedAmount);

            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                response = await ApiHttpClient.instance.put("customer/", item);
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                expect(response.data).toEqual({
                    ...item,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                });
            }
        });


    });

    describe('Delete', () => {
        test('customers', async () => {
            const ids = createTestData.delete.customerIds(10, seedAmount);

            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                response = await ApiHttpClient.instance.delete("customer/" + id);
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                expect(response.data).toBe(id);
                response = await ApiHttpClient.instance.get("customer");
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                expect(response.data.length).toBe(seedAmount - (i + 1));
                response = await ApiHttpClient.instance.get("address");
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                expect(response.data.length).toBe(seedAmount - (i + 1));
            }
        });

        test('orders', async () => {
            const ids = createTestData.delete.orderIds(10, seedAmount);

            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                response = await ApiHttpClient.instance.delete("order/" + id);
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                expect(response.data).toBe(id);
                response = await ApiHttpClient.instance.get("order");
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                expect(response.data.length).toBe(seedAmount - (i + 1));
                response = await ApiHttpClient.instance.get("order-item");
                expect(response.status).toBe(200);
                expect(typeof response.time).toBe("number");
                expect(response.data.length).toBe((seedAmount * 2) - (i + 1) * 2);
            }
        });
    });
});
