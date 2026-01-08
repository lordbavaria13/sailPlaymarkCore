import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, testUsers } from "../fixtures.js";

interface ApiError {
  response: {
    data: {
      message: string;
      statusCode?: number;
    };
    status?: number;
  };
}

interface User {
  username: string; 
  email: string;
  password: string;
  _id?: string;
}

suite("User API tests", () => {
   setup(async () => {
    await placemarkService.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await placemarkService.createUser(testUsers[i]);
    }
  });

  teardown(async () => {
  });
 

  test("create a user", async () => {
    const newUser = await placemarkService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

    test("delete all users", async () => {
    let returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await placemarkService.deleteAllUsers();
    returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });

  
    test("get a user - success", async () => {
    const user = testUsers[0] as User; 
    const returnedUser = await placemarkService.getUser(user._id!);
    assert.deepEqual(user, returnedUser);
  });

    test("get a user - fail", async () => {
    try {
      await placemarkService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (err: unknown) {
        const error = err as ApiError;
     assert.exists(error.response, "Error should have a response");
      assert.equal(error.response.data.message, "No User with this id");
    
    }
  });

    test("get a user - bad id", async () => {
    try {
      await placemarkService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (err: unknown) {
      const error = err as ApiError;
      assert.exists(error.response, "Error should have a response");
      assert.equal(error.response.data.message, "No User with this id");
      
    }
  });

  test("get a user - deleted user", async () => {
    await placemarkService.deleteAllUsers();
    try {
      const user = testUsers[0] as User;
      await placemarkService.getUser(user._id!);
      assert.fail("Should not return a response");
    } catch (err: unknown) {
      const error = err as ApiError;
      assert.exists(error.response, "Error should have a response");
      assert.equal(error.response.data.message, "No User with this id");
      
    }
  });
});


