import { ApiHttpClient } from "../utils/api-http-client";

describe('Product', () => {
    let endpoint = "seed/"
    let response: any;

    describe('seed controller', () => {
        test('should create 1.000.000 addresses, customers, orders, products, 200.000 order items, 100 categories', async () => {
            await ApiHttpClient.instance.get("seed/reset");
            response = await ApiHttpClient.instance.get(endpoint + "1000000");
            expect(response.status).toBe(200);
            expect(response.count).toEqual({
                address: 1000000,
                customer: 1000000,
                order: 1000000,
                orderItem: 2000000,
                product: 1000000,
                productCategory: 1000
            });

            response = await ApiHttpClient.instance.get("address");
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(100);

            response = await ApiHttpClient.instance.get("customer");
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(100);

            response = await ApiHttpClient.instance.get("product");
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(100);

            response = await ApiHttpClient.instance.get("product-category");
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(100);

            response = await ApiHttpClient.instance.get("order");
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(100);

            response = await ApiHttpClient.instance.get("order-item");
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(100);
        }, 120000);

        test("should reset the database", async () => {
            response = await ApiHttpClient.instance.get(endpoint + "reset");
            expect(response.status).toBe(200);

            response = await ApiHttpClient.instance.get("address");
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(0);

            response = await ApiHttpClient.instance.get("customer");
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(0);

            response = await ApiHttpClient.instance.get("product");
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(0);

            response = await ApiHttpClient.instance.get("product-category");
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(0);

            response = await ApiHttpClient.instance.get("order");
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(0);

            response = await ApiHttpClient.instance.get("order-item");
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(0);
        });


    });
});