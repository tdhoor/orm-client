import { ApiHttpClient } from "./utils/api-http-client";
import { IProduct } from "@core/models/entities/product.model";
import { IAddress } from "@core/models/entities/address.model";
import { IOrder } from "@core/models/entities/order.model";
import { ICustomer } from "@core/models/entities/customer.model";
import { IProductCategory } from "@core/models/entities/product-category.model";
import { DockerStrategy } from "./models/docker-strategy.model";
import { DockerTypeOrmPostgres } from "./models/docker-type-orm-postgres.model";
import { DockerPrismaPostgres } from "./models/docker-prisma-postgres.model";
import { DockerSequelizePostgres } from "./models/docker-sequelize-postgres.model";
import { IOrderItem } from "@core/models/entities/order-item.model";
import { createMock } from "@core/functions/create-entity-mock.function";

const compare = {
    address: (msg: string, a: IAddress, b: IAddress) => {
        let error = false;
        if (a.city !== b.city) {
            error = true;
        }
        if (a.street !== b.street) {
            error = true;
        }
        if (a.zipCode !== b.zipCode) {
            error = true;
        }
        if (a.country !== b.country) {
            error = true;
        }
        if (error) {
            console.log(msg + ": address error!", { a, b })
        } else {
            console.log(msg + ": addres ok!")
        }
        return error;
    },
    customer: (msg: string, a: ICustomer, b: ICustomer) => {
        let error = false;
        if (a.firstName !== b.firstName) {
            error = true;
        }
        if (a.lastName !== b.lastName) {
            error = true;
        }
        if (a.email !== b.email) {
            error = true;
        }
        if (a.phone !== b.phone) {
            error = true;
        }
        if (a.addressId !== b.addressId) {
            error = true;
        }
        if (error) {
            console.log(msg + ": customer error!", { a, b })
        } else {
            console.log(msg + ": customer ok!")
        }
        return error;
    },
    productCategory: (msg: string, a: IProductCategory, b: IProductCategory) => {
        let error = false;
        if (a.name !== b.name) {
            error = true;
        }
        if (error) {
            console.log(msg + ": category error!", { a, b })
        } else {
            console.log(msg + ": category ok!")
        }
        return error;
    },
    product: (msg: string, a: IProduct, b: IProduct) => {
        let error = false;
        if (a.name !== b.name) {
            error = true;
        }
        if (a.price !== b.price) {
            error = true;
        }
        if (a.productCategoryId !== b.productCategoryId) {
            error = true;
        }
        if (error) {
            console.log(msg + " product error!", { a, b })
        } else {
            console.log(msg + " product ok!")
        }
        return error;
    },
    order: (msg: string, a: IOrder, b: IOrder) => {
        let error = false;
        if (a.totalPrice !== b.totalPrice) {
            error = true;
        }
        if (a.customerId !== b.customerId) {
            error = true;
        }

        if (a?.orderItems && b?.orderItems) {
            if (a.orderItems?.length <= 0) {
                console.log(msg + " a - order-items empty!", { a })
            }
            if (b.orderItems?.length <= 0) {
                console.log(msg + " b - order-items empty!", { b })
            }
            if (a.orderItems?.length !== b.orderItems?.length) {
                error = true;
            }
            a.orderItems.forEach((item, i) => {
                error = compare.orderItem(msg, item, b.orderItems[i]);
            })
        }
        if (error) {
            console.log(msg + " order error!", { a, b })
        } else {
            console.log(msg + " order ok!")
        }
        return error;
    },
    orderItem: (msg: string, a: IOrderItem, b: IOrderItem) => {
        let error = false;
        if (a.quantity !== b.quantity) {
            error = true;
        }
        if (a.productId !== b.productId) {
            error = true;
        }
        if (error) {
            console.log(msg + " order-item error!", { a, b })
        } else {
            console.log(msg + " order-item ok!")
        }
        return error;
    }
}

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function logPretty(text: string, obj: object) {
    console.log(text, JSON.stringify(obj, null, 2));
}

function createTestData(id: number) {
    {
        const address = createMock.address(id);
        const customer = createMock.customer(id);
        customer.address = address;
        const category = createMock.productCategory(id);
        const product = createMock.product(id, id);
        product.productCategoryId = id;
        const orderItem: IOrderItem = { quantity: 2, productId: id };
        const order: IOrder = {
            totalPrice: Math.floor(product.price * 2 / 100) * 100,
            customerId: id,
            orderItems: [orderItem]
        }
        return { address, customer, category, product, order }
    }
}

const test = async (dockerStrategy: DockerStrategy) => {
    await dockerStrategy.composeUp();
    await timeout(5000);

    let { address, customer, category, product, order } = createTestData(1);

    console.log('====================================');
    console.log("CREATE");
    console.log('====================================');

    let readResponses = {
        address: null as IAddress,
        customer: null as ICustomer,
        category: null as IProductCategory,
        product: null as IProduct,
        order: null as IOrder,
        orderItem: null as IOrderItem
    }

    const POST_MSG = "POST";
    await ApiHttpClient.instance.post("customer", customer);
    console.log(POST_MSG + ": customer with address ok!");
    await ApiHttpClient.instance.post("product-category", category);
    console.log(POST_MSG + ": category ok!");
    await ApiHttpClient.instance.post("product", product);
    console.log(POST_MSG + ": product ok!");
    await ApiHttpClient.instance.post("order", order);
    console.log(POST_MSG + ": order ok!");

    console.log('====================================');
    console.log("READ");
    console.log('====================================');

    const getAddressRes = await ApiHttpClient.instance.get("address");
    const getCustomerRes = await ApiHttpClient.instance.get("customer");
    const getCategoryRes = await ApiHttpClient.instance.get("product-category");
    const getProductRes = await ApiHttpClient.instance.get("product");
    const getOrderRes = await ApiHttpClient.instance.get("order");
    const getOrderItemRes = await ApiHttpClient.instance.get("order-item");

    readResponses.customer = getCustomerRes.data[0];
    readResponses.address = getAddressRes.data[0];
    readResponses.category = getCategoryRes.data[0];
    readResponses.product = getProductRes.data[0];
    readResponses.order = getOrderRes.data[0];
    readResponses.orderItem = getOrderItemRes.data[0];

    const CREATE_GET_MSG = "CREATE-GET";
    compare.address(CREATE_GET_MSG, address, readResponses.address);
    compare.customer(CREATE_GET_MSG, customer, readResponses.customer);
    compare.productCategory(CREATE_GET_MSG, category, readResponses.category);
    compare.product(CREATE_GET_MSG, product, readResponses.product);
    compare.order(CREATE_GET_MSG, order, readResponses.order);
    compare.orderItem(CREATE_GET_MSG, order.orderItems[0], readResponses.orderItem);


    console.log('====================================');
    console.log("UPDATE");
    console.log('====================================');

    const updatedData = {
        address: <IAddress>{
            id: 1,
            city: "kufstein",
            country: "AUT",
            street: "Kaiserbergstrasse 30",
            zipCode: "6330",
            customerId: 1
        },
        customer: <ICustomer>{
            id: 1,
            firstName: "Thomas",
            lastName: "Dorfer",
            email: "t.dorfer.td@gmail.com",
            password: "passwort123",
            phone: "004367763001594"
        },
        category: <IProductCategory>{
            id: 1,
            name: "Kleidung"
        },
        product: <IProduct>{
            id: 1,
            description: "Ein tolles Produkt",
            name: "Handy",
            price: 9999,
            productCategoryId: 1
        }
    }

    const putAddressRes = await ApiHttpClient.instance.put("address", updatedData.address);
    const putCustomerRes = await ApiHttpClient.instance.put("customer", updatedData.customer);
    const putCategory = await ApiHttpClient.instance.put("product-category", updatedData.category);
    const putProductRes = await ApiHttpClient.instance.put("product", updatedData.product);

    const UPDATE_GET_MSG = "UPDATE-GET";
    compare.address(UPDATE_GET_MSG, updatedData.address, putAddressRes.data);
    compare.customer(UPDATE_GET_MSG, updatedData.customer, putCustomerRes.data);
    compare.productCategory(UPDATE_GET_MSG, updatedData.category, putCategory.data);
    compare.product(UPDATE_GET_MSG, updatedData.product, putProductRes.data);


    console.log('====================================');
    console.log("READ RELATIONS");
    console.log('====================================');
    const READ_RELATIONS_MSG = "READ RELATIONS";
    const userProducts = await ApiHttpClient.instance.get("customer/1/products");
    const userOrders = await ApiHttpClient.instance.get("customer/1/orders");
    const productFromCategory = await ApiHttpClient.instance.get("product/category/" + updatedData.category.name);

    logPretty("hehe", { userProducts, userOrders, productFromCategory })
    compare.product(READ_RELATIONS_MSG + " - product from customer", updatedData.product, userProducts.data[0]);
    compare.order(READ_RELATIONS_MSG + " - order from customer", readResponses.order, userOrders.data[0]);
    compare.product(READ_RELATIONS_MSG + " - product from category", updatedData.product, productFromCategory.data[0]);

    console.log('====================================');
    console.log("DELETE");
    console.log('====================================');

    const DELETE_MSG = "DELETE";

    await ApiHttpClient.instance.delete("address/1");
    const delAddressRes = await ApiHttpClient.instance.get("address");
    if (delAddressRes.data.length > 0) {
        logPretty("Delete address error", delAddressRes);
    } else {
        console.log(DELETE_MSG + " address ok!");
    }

    await ApiHttpClient.instance.delete("customer/1");
    const delCustomerRes = await ApiHttpClient.instance.get("customer");
    if (delCustomerRes.data.length > 0) {
        logPretty("Delete customer error", delCustomerRes);
    } else {
        console.log(DELETE_MSG + " customer ok!")
    }

    await ApiHttpClient.instance.delete("product-category/1");
    const delCategoryRes = await ApiHttpClient.instance.get("product-category");
    if (delCategoryRes.data.length > 0) {
        logPretty("Delete category error", delCategoryRes);
    } else {
        console.log(DELETE_MSG + " category ok!")
    }

    await ApiHttpClient.instance.delete("product/1");
    const delProductRes = await ApiHttpClient.instance.get("product");
    if (delProductRes.data.length > 0) {
        logPretty("Delete product error", delProductRes);
    } else {
        console.log(DELETE_MSG + " product ok!")
    }

    await ApiHttpClient.instance.delete("order/1");
    const delOrderRes = await ApiHttpClient.instance.get("order");
    if (delOrderRes.data.length > 0) {
        logPretty("Delete order error", delOrderRes);
    } else {
        console.log(DELETE_MSG + " order ok!")
    }

    const delOrderItemRes = await ApiHttpClient.instance.get("order-item");
    if (delOrderItemRes.data.length > 0) {
        logPretty("Delete order item error", delOrderItemRes);
    } else {
        console.log(DELETE_MSG + " order item ok!")
    }

    await dockerStrategy.composeDown();
}

const main = async () => {
    await test(new DockerTypeOrmPostgres());
    await test(new DockerPrismaPostgres());
    await test(new DockerSequelizePostgres());
}

main();
