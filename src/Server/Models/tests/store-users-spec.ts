import { storeUsers } from "../store-users";

const store = new storeUsers();

describe("Store User Model" , () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('index should return a list of users', async () => {
        const result = await store.index();
        expect(result).toEqual([]);
    });
});