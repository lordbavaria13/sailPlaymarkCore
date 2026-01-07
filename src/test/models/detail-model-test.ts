import { assert } from "chai";
import { db } from "../models/db.js";
import { maggie } from "./fixtures.js";
import { assertSubset } from "./test-utils.js";
import { DetailsProps } from "../models/json/detail-json-store.js"; // Use the exported type

suite("Details API tests", () => {

  setup(async () => {
    await db.init("mongo");
    await db.detailStore!.deleteAllDetails();
    await db.placemarkStore!.deleteAllPlacemarks();
    await db.userStore!.deleteAllUsers();
  });

  test("create details", async () => {
    const user = await db.userStore!.addUser(maggie);
    const placemark = await db.placemarkStore!.addPlacemarks({ title: "P1", userId: user._id! });
    const details = {
      pmId: placemark!._id!,
      latitude: 51.5,
      longitude: -0.1,
      title: "Tower",
      description: "Tall tower"
    };
    const newDetails = await db.detailStore!.addDetails(details);
    assertSubset(details, newDetails);
  });

  test("delete all details", async () => {
    const user = await db.userStore!.addUser(maggie);
    const placemark = await db.placemarkStore!.addPlacemarks({ title: "P2", userId: user._id! });
    const testDetails = [
      { pmId: placemark!._id!, latitude: 1, longitude: 1, title: "A", description: "a" },
      { pmId: placemark!._id!, latitude: 2, longitude: 2, title: "B", description: "b" },
      { pmId: placemark!._id!, latitude: 3, longitude: 3, title: "C", description: "c" }
    ];
    for (let i = 0; i < testDetails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await db.detailStore!.addDetails(testDetails[i]);
    }
    let returned = await db.detailStore!.getAllDetails();
    assert.equal(returned.length, 3);
    await db.detailStore!.deleteAllDetails();
    returned = await db.detailStore!.getAllDetails();
    assert.equal(returned.length, 0);
  });

  test("get details - success", async () => {
    const user = await db.userStore!.addUser(maggie);
    const placemark = await db.placemarkStore!.addPlacemarks({ title: "P3", userId: user._id! });
    const details = {
      pmId: placemark!._id!,
      latitude: 10,
      longitude: 20,
      title: "Secret",
      description: "Hidden spot"
    };
    const added = await db.detailStore!.addDetails(details);
    const returnedById = await db.detailStore!.getDetailsById(added!._id!);
    assertSubset(details, added);
    assertSubset(details, returnedById);
    const returnedByPm = await db.detailStore!.getDetailByPmId(placemark!._id!);
    assertSubset(details, returnedByPm);
  });

  test("delete One Details - success", async () => {
    const user = await db.userStore!.addUser(maggie);
    const placemark = await db.placemarkStore!.addPlacemarks({ title: "P4", userId: user._id! });
    const testDetails: DetailsProps[] = [
      { pmId: placemark!._id!, latitude: 1, longitude: 1, title: "One", description: "one" },
      { pmId: placemark!._id!, latitude: 2, longitude: 2, title: "Two", description: "two" },
      { pmId: placemark!._id!, latitude: 3, longitude: 3, title: "Three", description: "three" }
    ];
    for (let i = 0; i < testDetails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testDetails[i] = (await db.detailStore!.addDetails(testDetails[i]))!;
    }
    const first = (await db.detailStore!.getAllDetails())[0];
    await db.detailStore!.deleteDetailsById(first._id!);
    const returned = await db.detailStore!.getAllDetails();
    assert.equal(returned.length, testDetails.length - 1);
    const deleted = await db.detailStore!.getDetailsById(first._id!);
    assert.isNull(deleted);
  });

  test("get details - failures", async () => {
    const noDetails = await db.detailStore!.getDetailsById("123");
    assert.isNull(noDetails);
    const noByPm = await db.detailStore!.getDetailByPmId("no-pm");
    assert.isNull(noByPm);
  });

  test("get details - bad params", async () => {
    const nullDetails = await db.detailStore!.getDetailsById("");
    assert.isNull(nullDetails);
    const emptyByPm = await db.detailStore!.getDetailByPmId("");
    assert.isNull(emptyByPm);
  });

  test("delete One Details - fail", async () => {
    const user = await db.userStore!.addUser(maggie);
    const placemark = await db.placemarkStore!.addPlacemarks({ title: "P5", userId: user._id! });
    const details = await db.detailStore!.addDetails({ pmId: placemark!._id!, latitude: 0, longitude: 0, title: "Stay", description: "stay" });
    await db.detailStore!.deleteDetailsById("bad-id");
    const all = await db.detailStore!.getAllDetails();
    assert.equal(all.length, 1);
    assert.deepEqual(all[0], details);
  });

  test("update details - success and fail", async () => {
    const user = await db.userStore!.addUser(maggie);
    const placemark = await db.placemarkStore!.addPlacemarks({ title: "P6", userId: user._id! });
    const details = await db.detailStore!.addDetails({ pmId: placemark!._id!, latitude: 5, longitude: 5, title: "Old", description: "Old desc" });
    const updatedObj = { ...details!, title: "New", description: "New desc" };
    const updated = await db.detailStore!.updateDetailsById(details!._id!, updatedObj);
    assert.isNotNull(updated);
    assert.equal(updated!.title, "New");
    const notFound = await db.detailStore!.updateDetailsById("bad-id", updatedObj);
    assert.isNull(notFound);
  });

});