import { assert } from "chai";
import { db } from "../../models/db.js";
import { maggie } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Placemark Model tests", () => {

  setup(async () => {
    await db.init("mongo");
    await db.placemarkStore!.deleteAllPlacemarks();
    await db.userStore!.deleteAllUsers();
  });

  test("create a placemark", async () => {
    const user = await db.userStore!.addUser(maggie);
    const placemark = { title: "Paradise", userId: user._id!, categories: [], images: [] };
    const newPlacemark = await db.placemarkStore!.addPlacemarks(placemark);
    assertSubset(placemark, newPlacemark);
  });

  test("delete all placemarks", async () => {
    const user = await db.userStore!.addUser(maggie);
    const testPlacemarks = [
      { title: "A", userId: user._id!, categories: [], images: [] },
      { title: "B", userId: user._id!, categories: [], images: [] },
      { title: "C", userId: user._id!, categories: [], images: [] }
    ];
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await db.placemarkStore!.addPlacemarks(testPlacemarks[i]);
    }
    let returnedPlacemarks = await db.placemarkStore!.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, 3);
    await db.placemarkStore!.deleteAllPlacemarks();
    returnedPlacemarks = await db.placemarkStore!.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, 0);
  });

  test("get a placemark - success", async () => {
    const user = await db.userStore!.addUser(maggie);
    const placemark = { title: "Secret Cove", userId: user._id!, categories: [], images: [] };
    const added = await db.placemarkStore!.addPlacemarks(placemark);
    const returnedById = await db.placemarkStore!.getPlacemarkById(added!._id!);
    assert.deepEqual(added, returnedById);
    const returnedByUser = await db.placemarkStore!.getUserPlacemarks(user._id!);
    assert.equal(returnedByUser.length, 1);
    assert.deepEqual(returnedByUser[0], added);
  });

  test("delete One Placemark - success", async () => {
    const user = await db.userStore!.addUser(maggie);
    const testPlacemarks: { title: string; userId: string; categories?: string[]; images?: string[] }[] = [
      { title: "One", userId: user._id!, categories: [], images: [] },
      { title: "Two", userId: user._id!, categories: [], images: [] },
      { title: "Three", userId: user._id!, categories: [], images: [] }
    ];
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await db.placemarkStore!.addPlacemarks(testPlacemarks[i]);
    }
    const first = (await db.placemarkStore!.getAllPlacemarks())[0];
    await db.placemarkStore!.deletePlacemarkById(first._id!);
    const returned = await db.placemarkStore!.getAllPlacemarks();
    assert.equal(returned.length, testPlacemarks.length - 1);
    const deleted = await db.placemarkStore!.getPlacemarkById(first._id!);
    assert.isNull(deleted);
  });

  test("get a placemark - failures", async () => {
    const noPlacemark = await db.placemarkStore!.getPlacemarkById("123");
    assert.isNull(noPlacemark);
    const userPlacemarks = await db.placemarkStore!.getUserPlacemarks("no-user");
    assert.equal(userPlacemarks.length, 0);
  }); 

  test("get a placemark - bad params", async () => {
    const nullPlacemark = await db.placemarkStore!.getPlacemarkById("");
    assert.isNull(nullPlacemark);
    const emptyUserPlacemarks = await db.placemarkStore!.getUserPlacemarks("");
    assert.equal(emptyUserPlacemarks.length, 0);
  });

  test("delete One Placemark - fail", async () => {
    const user = await db.userStore!.addUser(maggie);
    const placemark = await db.placemarkStore!.addPlacemarks({ title: "Stay", userId: user._id!, categories: [], images: [] });
    await db.placemarkStore!.deletePlacemarkById("bad-id");
    const all = await db.placemarkStore!.getAllPlacemarks();
    assert.equal(all.length, 1);
    assert.deepEqual(all[0], placemark);
  });

  test("update placemark - success and fail", async () => {
    const user = await db.userStore!.addUser(maggie);
    const placemark = await db.placemarkStore!.addPlacemarks({ title: "Old", userId: user._id!, categories: [], images: [] });
    const updated = await db.placemarkStore!.updatePlacemarkById(placemark!._id!, { title: "New" });
    assert.isNotNull(updated);
    assert.equal(updated!.title, "New");
    const notFound = await db.placemarkStore!.updatePlacemarkById("bad-id", { title: "X" });
    assert.isNull(notFound);
  });

});