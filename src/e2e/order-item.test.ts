import { ICustomer } from "@core/models/entities/customer.model";
import { IOrderItem } from "@core/models/entities/order-item.model";
import { IOrder } from "@core/models/entities/order.model";
import { IProduct } from "@core/models/entities/product.model";
import { ApiHttpClient } from "../utils/api-http-client";

describe('OrderItem', () => {
    let endpoint = "order-item"
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
    let order: IOrder = {
        totalPrice: 20,
        customerId: 1
    };
    let orderItem: IOrderItem = {
        quantity: 2,
        orderId: 1,
        productId: 1
    }

    beforeEach(async () => {
        await ApiHttpClient.instance.get("seed/reset");
        await ApiHttpClient.instance.post("customer", customer);
        await ApiHttpClient.instance.post("product", product);
        await ApiHttpClient.instance.post("order", order);
    })

    describe('createOne', () => {
        test('should create a new order-item', async () => {
            response = await ApiHttpClient.instance.post<IOrderItem>(endpoint, orderItem);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...orderItem,
                id: 1
            });
        });

        test('should fail because of foreign key error orderId = 0', async () => {
            response = await ApiHttpClient.instance.post(endpoint, { ...orderItem, orderId: 0 });
            expect(response.status).toBe(500);
        });

        test('should fail because of foreign key error orderId = 2', async () => {
            response = await ApiHttpClient.instance.post(endpoint, { ...orderItem, orderId: 2 });
            expect(response.status).toBe(500);
        });

        test('should fail because of foreign key error productId = 0', async () => {
            response = await ApiHttpClient.instance.post(endpoint, { ...orderItem, productId: 0 });
            expect(response.status).toBe(500);
        });

        test('should fail because of foreign key error productId = 2', async () => {
            response = await ApiHttpClient.instance.post(endpoint, { ...orderItem, productId: 2 });
            expect(response.status).toBe(500);
        });
    });


    describe('getOneById', () => {
        test(`should return the order-item with id 1`, async () => {
            response = await ApiHttpClient.instance.post<IOrderItem>(endpoint, orderItem);
            response = await ApiHttpClient.instance.get<IOrderItem>(`${endpoint}/1`);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...orderItem,
                id: 1
            });
        });

        test(`should return null because because id 0 not found`, async () => {
            response = await ApiHttpClient.instance.get<IOrderItem>(`${endpoint}/0`);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toBe(null);
        });

        test(`should return null because id 2 not found`, async () => {
            response = await ApiHttpClient.instance.get<IOrderItem>(`${endpoint}/2`);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toBe(null);
        });
    });

    describe('getAll', () => {
        test(`should return all order-items`, async () => {
            response = await ApiHttpClient.instance.post<IOrderItem>(endpoint, orderItem);
            response = await ApiHttpClient.instance.get<IOrderItem[]>(endpoint);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual([{
                ...orderItem,
                id: 1
            }]);
        });
    });

    describe('updateOne', () => {
        test(`should update order-item quantity to 10`, async () => {
            const quantity = 10;
            response = await ApiHttpClient.instance.post<IOrderItem>(endpoint, orderItem);
            response = await ApiHttpClient.instance.put<IOrderItem>(endpoint, { ...response.data, id: 1, quantity });
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...orderItem,
                id: 1,
                quantity
            });
        });
    });

    describe('deleteOneById', () => {
        test('should delete an order-item by ID', async () => {
            response = await ApiHttpClient.instance.post<IOrderItem>(endpoint, orderItem);
            response = await ApiHttpClient.instance.delete(`${endpoint}/1`);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual(1)
        });
    });
});