import { assert } from "chai";
import { db } from "../models/db.js";

suite("User API tests", () => {

  const maggie = {
    username: "Maggie",
    email: "maggie@simpson.com",
    password: "secret",
  };

  setup(async () => {
    db.init();
  });

  test("create a user", async () => {
    const newUser = await db.userStore!.addUser(maggie);
    assert.deepEqual(maggie, newUser)
  });
});
