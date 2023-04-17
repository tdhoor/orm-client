import { describe, expect, test } from '@jest/globals';
import { IAddress } from '@core/models/entities/address.model';
import { ICustomer } from '@core/models/entities/customer.model';
import { ApiHttpClient } from '../utils/api-http-client';
import { IProduct } from '@core/models/entities/product.model';
import { IOrder } from '@core/models/entities/order.model';

describe('Customer', () => {
    let endpoint = "customer"
    let response;
    let customer: ICustomer = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@mail.com",
        password: "password",
        phone: "123-456-7890"
    }

    beforeEach(async () => {
        await ApiHttpClient.instance.get("seed/reset");
    })

    describe('createOne', () => {
        test('should create a new customer', async () => {
            response = await ApiHttpClient.instance.post<ICustomer>(endpoint, customer);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");

            expect(response.data.id).toEqual(1);
            expect(response.data.createdAt).toEqual(expect.any(String));
            expect(response.data.updatedAt).toEqual(expect.any(String));
            expect(response.data.firstName).toBe(customer.firstName);
            expect(response.data.lastName).toBe(customer.lastName);
            expect(response.data.email).toBe(customer.email);
            expect(response.data.password).toBe(customer.password);
            expect(response.data.phone).toBe(customer.phone);

            if (response.data.address !== undefined) {
                expect(response.data.address).toBeNull();
            }
        });

        test('should create a new customer with address', async () => {
            let address: Partial<IAddress> = {
                street: '456 Main St',
                city: 'Anytown',
                country: 'USA',
                zipCode: '67890',
            }
            response = await ApiHttpClient.instance.post<ICustomer>(endpoint, { ...customer, address });
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...customer,
                id: 1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                address: {
                    ...address,
                    id: 1,
                    customerId: 1
                }
            });
        });
    });

    describe('createMany', () => {
        test('should create 10 new customers', async () => {
            let customers = Array.from({ length: 10000 }).map(() => ({ ...customer }));
            await ApiHttpClient.instance.post(endpoint + "/bulk", customers);
            response = await ApiHttpClient.instance.get<ICustomer[]>(endpoint);
            expect(response.status).toBe(200);
            expect(response.data.length).toEqual(100);
            response.data.sort((x, y) => x.id < y.id ? -1 : 1).forEach((data, index) => {
                expect(data.id).toEqual(index + 1);
                expect(data.createdAt).toEqual(expect.any(String));
                expect(data.updatedAt).toEqual(expect.any(String));
                expect(data.firstName).toBe(customer.firstName);
                expect(data.lastName).toBe(customer.lastName);
                expect(data.email).toBe(customer.email);
                expect(data.password).toBe(customer.password);
                expect(data.phone).toBe(customer.phone);

                if (data.address !== undefined) {
                    expect(data.address).toBeNull();
                }
            });
            response = await ApiHttpClient.instance.get<ICustomer[]>(endpoint + "/10000");
            expect(response.status).toBe(200);
            const lastCustomer = customers[customers.length - 1];
            const lastResCustomer = response.data;
            expect(lastResCustomer.id).toEqual(10000);
            expect(lastResCustomer.createdAt).toEqual(expect.any(String));
            expect(lastResCustomer.updatedAt).toEqual(expect.any(String));
            expect(lastResCustomer.firstName).toBe(lastCustomer.firstName);
            expect(lastResCustomer.lastName).toBe(lastCustomer.lastName);
            expect(lastResCustomer.email).toBe(lastCustomer.email);
            expect(lastResCustomer.password).toBe(lastCustomer.password);
            expect(lastResCustomer.phone).toBe(lastCustomer.phone);
        }, 120000);
    });

    describe('getOneById', () => {
        test(`should return the customer with id 1`, async () => {
            await ApiHttpClient.instance.post<ICustomer>(endpoint, customer);
            response = await ApiHttpClient.instance.get<ICustomer>(endpoint + "/1");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...customer,
                id: 1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                address: null
            });
        });

        test(`should return null because because id 2 not found`, async () => {
            response = await ApiHttpClient.instance.get(endpoint + "/2");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual(null);
        });

        test(`should return null because id 0 not found`, async () => {
            response = await ApiHttpClient.instance.get(endpoint + "/0");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual(null);
        });
    });

    describe('getAll', () => {
        test(`should return all customers`, async () => {
            let customers = Array.from({ length: 10 }).map(() => ({ ...customer }));
            await ApiHttpClient.instance.post(endpoint + "/bulk", customers);
            response = await ApiHttpClient.instance.get<ICustomer[]>(endpoint);
            expect(response.status).toBe(200);
            expect(response.data.length).toEqual(10);
            response.data.sort((x, y) => x.id < y.id ? -1 : 1).forEach((data, index) => {
                expect(data.id).toEqual(index + 1);
                expect(data.createdAt).toEqual(expect.any(String));
                expect(data.updatedAt).toEqual(expect.any(String));
                expect(data.firstName).toBe(customer.firstName);
                expect(data.lastName).toBe(customer.lastName);
                expect(data.email).toBe(customer.email);
                expect(data.password).toBe(customer.password);
                expect(data.phone).toBe(customer.phone);

                if (data.address !== undefined) {
                    expect(data.address).toBeNull();
                }
            });
        });
    });

    describe('updateOne', () => {
        let firstName = "Thomas";
        let password = "$FWFjs-9df8klsadjf"
        test(`should update customer name to ${firstName}, pwd: ${password}`, async () => {
            response = await ApiHttpClient.instance.post<ICustomer>(endpoint, customer);
            response = await ApiHttpClient.instance.put<ICustomer>(endpoint, { ...response.data, id: 1, firstName, password });
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...customer,
                id: 1,
                firstName,
                password,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            });
        });
    });

    describe('deleteOneById', () => {
        test('should delete an customer by ID', async () => {
            response = await ApiHttpClient.instance.post<ICustomer>(endpoint, customer);
            response = await ApiHttpClient.instance.delete(endpoint + "/1");
            expect(response.data).toEqual(1);
            const response3 = await ApiHttpClient.instance.get<ICustomer[]>(endpoint);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response3.data.length).toEqual(0);
        });
    });

    describe('getCustomerOrders', () => {
        test('should return customer orders', async () => {
            const product: IProduct = {
                description: 'test',
                name: 'test',
                price: 100,
            }
            const order: IOrder = {
                customerId: 1,
                totalPrice: 100,
                orderItems: [
                    {
                        quantity: 1,
                        productId: 1,
                    }
                ]
            }
            await ApiHttpClient.instance.post(endpoint, customer);
            await ApiHttpClient.instance.post("product", product);
            await ApiHttpClient.instance.post("order", order);
            response = await ApiHttpClient.instance.get<IOrder[]>(endpoint + "/1/orders");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual([{
                id: 1,
                totalPrice: order.totalPrice,
                customerId: order.customerId,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                orderItems: [
                    {
                        id: 1,
                        quantity: order.orderItems[0].quantity,
                        productId: order.orderItems[0].productId,
                        orderId: 1
                    }
                ]
            }]);
        });
    });

    describe('getCustomerProducts', () => {
        test('should return customer products', async () => {
            const product: IProduct = {
                description: 'test',
                name: 'test',
                price: 100,
            }
            const order: IOrder = {
                customerId: 1,
                totalPrice: 100,
                orderItems: [
                    {
                        quantity: 1,
                        productId: 1
                    }
                ]
            }
            await ApiHttpClient.instance.post(endpoint, customer);
            await ApiHttpClient.instance.post("product", product);
            await ApiHttpClient.instance.post("order", order);
            response = await ApiHttpClient.instance.get<IOrder[]>(endpoint + "/1/products");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual([{
                ...product,
                id: 1,
                productCategoryId: null,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }]);
        });
    });
});
