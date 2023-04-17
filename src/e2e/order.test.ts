import { ICustomer } from "@core/models/entities/customer.model";
import { IOrderItem } from "@core/models/entities/order-item.model";
import { IOrder } from "@core/models/entities/order.model";
import { IProduct } from "@core/models/entities/product.model";
import { ApiHttpClient } from "../utils/api-http-client";

describe('Order', () => {
    let endpoint = "order"
    let response;
    let customer: ICustomer = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@mail.com",
        password: "password",
        phone: "123-456-7890"
    }
    let product: IProduct = {
        name: "Book x",
        price: 10,
        description: "A book",
        productCategoryId: null
    }
    let orderItem: IOrderItem = {
        productId: 1,
        quantity: 2
    }
    let order: IOrder = {
        totalPrice: 20,
        customerId: 1,
        orderItems: [orderItem]
    };

    beforeEach(async () => {
        await ApiHttpClient.instance.get("seed/reset");
        await ApiHttpClient.instance.post("customer", customer);
        await ApiHttpClient.instance.post("product", product);
    })

    describe('createOne', () => {
        test('should create a new entity', async () => {
            response = await ApiHttpClient.instance.post<IOrder>(endpoint, order);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...order,
                id: 1,
                orderItems: [
                    {
                        ...orderItem,
                        id: 1,
                        orderId: 1
                    }
                ],
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            });
        });

        test('should fail because of foreign key error customerId = 0', async () => {
            response = await ApiHttpClient.instance.post(endpoint, { ...order, customerId: 0 });
            expect(response.status).toBe(500);
        });

        test('should fail because of foreign key error customerId = 2', async () => {
            response = await ApiHttpClient.instance.post(endpoint, { ...order, customerId: 2 });
            expect(response.status).toBe(500);
        });

        test('should fail because of foreign key error productId = 0', async () => {
            response = await ApiHttpClient.instance.post(endpoint, {
                ...order,
                orderItems: [
                    {
                        ...orderItem,
                        productId: 0
                    }
                ]
            });
            expect(response.status).toBe(500);
        });

        test('should fail because of foreign key error productId = 2', async () => {
            response = await ApiHttpClient.instance.post(endpoint, {
                ...order,
                orderItems: [
                    {
                        ...orderItem,
                        productId: 2
                    }
                ]
            });
            expect(response.status).toBe(500);
        });
    });


    describe('getOneById', () => {
        test(`should return the entity with id 1`, async () => {
            response = await ApiHttpClient.instance.post<IOrder>(endpoint, order);
            response = await ApiHttpClient.instance.get<IOrder>(`${endpoint}/1`);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...order,
                id: 1,
                orderItems: [
                    {
                        ...orderItem,
                        id: 1,
                        orderId: 1
                    }
                ],
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            });
        });

        test(`should return null because because id 0 not found`, async () => {
            response = await ApiHttpClient.instance.get<IOrder>(`${endpoint}/0`);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toBe(null);
        });

        test(`should return null because id 2 not found`, async () => {
            response = await ApiHttpClient.instance.get<IOrder>(`${endpoint}/2`);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toBe(null);
        });
    });

    describe('getAll', () => {
        test(`should return all orders`, async () => {
            response = await ApiHttpClient.instance.post<IOrder>(endpoint, order);
            response = await ApiHttpClient.instance.get<IOrder[]>(endpoint);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual([
                {
                    ...order,
                    id: 1,
                    orderItems: [
                        {
                            ...orderItem,
                            id: 1,
                            orderId: 1
                        }
                    ],
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            ]);
        });
    });

    describe('updateOne', () => {
        test(`should update order price to 40`, async () => {
            const totalPrice = 40;
            response = await ApiHttpClient.instance.post<IOrder>(endpoint, order);
            delete response.data.orderItems;
            response = await ApiHttpClient.instance.put<IOrder[]>(endpoint, { ...response.data, id: 1, totalPrice });
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                totalPrice,
                id: 1,
                customerId: 1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            });
        });
    });

    describe('deleteOneById', () => {
        test('should delete an entity by ID', async () => {
            response = await ApiHttpClient.instance.post<IOrder>(endpoint, order);
            response = await ApiHttpClient.instance.delete(`${endpoint}/1`);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual(1);
        });
    });
});