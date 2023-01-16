import { storeOrder } from "../Models/store-orders";

const store = new storeOrder();

describe("Store Order Model" , () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('index should return a list of orders', async () => {
        const result = await store.index();
        expect(result).toEqual([]);
    });
});