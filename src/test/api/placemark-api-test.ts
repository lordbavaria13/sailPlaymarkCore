import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, mozart, testPlacemark, testPlacemarks } from "../fixtures.js";

suite("Placemark API tests", () => {
  let user: { _id?: string } | null = null;

  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggie);
    await placemarkService.deleteAllPlacemarks();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggie);
    if (!user._id) assert.fail("User not created");
    mozart.userId = user._id;
  });


  teardown(async () => {});

  test("create placemark", async () => {
    const newPlacemark = { ...testPlacemark, userId: user!._id! };
    const returnedPlacemark = await placemarkService.createPlacemark(newPlacemark);
    assert.isNotNull(returnedPlacemark);
    assertSubset(newPlacemark, returnedPlacemark);
    assert.isDefined(returnedPlacemark._id);
  });

  test("delete a placemark", async () => {
    const newPlacemark = { ...testPlacemark, userId: user!._id! };
    const returnedPlacemark = await placemarkService.createPlacemark(newPlacemark);
    assert.isDefined(returnedPlacemark._id);

    const deleteResponse = await placemarkService.deletePlacemark(returnedPlacemark._id!);
    assert.equal(deleteResponse.status, 204);

    const placemarks = await placemarkService.getAllPlacemarks();
    assert.equal(placemarks.length, 0);
  });

  test("create multiple placemarks", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPlacemark({ ...testPlacemarks[i], userId: user!._id! });
    }
    const returnedPlacemarks = await placemarkService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length);
  });

  test("remove non-existant placemark", async () => {
    try {
      await placemarkService.deletePlacemark("1234");
      assert.fail("Should not return a response");
    } catch (err: any) {
      assert.exists(err.response, "Error should have a response");
      assert.equal(err.response.status, 404);
      assert.equal(err.response.data.message, "No Placemark with this id");
    }
  });
});
