import { describe, expect, test } from '@jest/globals';
import { IAddress } from '@core/models/entities/address.model';
import { ApiHttpClient } from '../utils/api-http-client';
import { ICustomer } from '@core/models/entities/customer.model';

describe('Address', () => {
    let endpoint = "address"
    let response;
    let customer: ICustomer = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@mail.com",
        password: "password",
        phone: "123-456-7890"
    }
    let address: IAddress = {
        street: '456 Main St',
        city: 'Anytown',
        zipCode: '67890',
        country: 'USA',
        customerId: 1,
    }

    beforeEach(async () => {
        await ApiHttpClient.instance.get("seed/reset");
        await ApiHttpClient.instance.post("customer", customer);
    })

    describe('createOne', () => {
        test('should create a new address', async () => {
            response = await ApiHttpClient.instance.post<IAddress>(endpoint, address);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...address,
                id: 1,
            });
        });

        test('should fail because of foreign key error customerId = 0', async () => {
            response = await ApiHttpClient.instance.post(endpoint, { ...address, customerId: 0 });
            expect(response.status).toBe(500);
        });

        test('should fail because of foreign key error customerId = 2', async () => {
            response = await ApiHttpClient.instance.post(endpoint, { ...address, customerId: 2 });
            expect(response.status).toBe(500);
        });
    });

    describe('getOneById', () => {
        test(`should return the address with id 1`, async () => {
            await ApiHttpClient.instance.post(endpoint, { ...address });
            response = await ApiHttpClient.instance.get(endpoint + "/1");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({ ...address, id: 1 });
        });
        test(`should return null because because id 0 not found`, async () => {
            response = await ApiHttpClient.instance.get(endpoint + "/0");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual(null);
        });
        test(`should return null because id 2 not found`, async () => {
            response = await ApiHttpClient.instance.get(endpoint + "/2");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual(null);
        });
    });

    describe('getAll', () => {
        test(`should return all addresses`, async () => {
            await ApiHttpClient.instance.post(endpoint, { ...address });
            response = await ApiHttpClient.instance.get<IAddress[]>(endpoint);
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data.length).toBe(1);
            expect(response.data).toEqual([{
                ...address,
                id: 1
            }]);
        });
    });

    describe('updateOne', () => {
        test(`should update address city to Kufstein`, async () => {
            response = await ApiHttpClient.instance.post(endpoint, { ...address, customerId: 1 });
            const city = "Kufstein";
            response = await ApiHttpClient.instance.put(endpoint, { ...response.data, id: 1, city });
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual({
                ...address,
                id: 1,
                city
            });
        });
    });

    describe('deleteOneById', () => {
        test('should delete an address by ID', async () => {
            response = await ApiHttpClient.instance.post(endpoint, { ...address, customerId: 1 });
            response = await ApiHttpClient.instance.delete(endpoint + "/1");
            expect(response.status).toBe(200);
            expect(typeof response.time).toBe("number");
            expect(response.data).toEqual(1);
        });


    });
});
