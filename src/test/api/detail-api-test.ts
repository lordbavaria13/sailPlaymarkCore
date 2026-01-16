import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import { maggie, concerto, testDetails, testPlacemark } from "../fixtures.js";

suite("Detail API tests", () => {
	let user: { _id?: string } | null = null;
	let placemark: { _id?: string } | null = null;

  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggie);
    await placemarkService.deleteAllDetails();
    await placemarkService.deleteAllPlacemarks();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggie);
    if (!user._id) assert.fail("User not created");
		placemark = await placemarkService.createPlacemark({ ...testPlacemark, userId: user._id });
		concerto.pmId = placemark._id!;
		testDetails.forEach((detail) => {
			detail.pmId = placemark!._id!;
		});
  });

	teardown(async () => {});

	test("create detail", async () => {
		const returnedDetail = await placemarkService.createDetail(concerto);
		assert.isNotNull(returnedDetail);
		assertSubset(concerto, returnedDetail);
		assert.isDefined(returnedDetail._id);
	});

	test("create Multiple details", async () => {
		for (let i = 0; i < testDetails.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			await placemarkService.createDetail(testDetails[i]);
		}
		const returned = await placemarkService.getAllDetails();
		assert.equal(returned.length, testDetails.length);
	});

	test("Delete Detail", async () => {
		const returnedDetail = await placemarkService.createDetail(concerto);
		const deleteResponse = await placemarkService.deleteDetail(returnedDetail._id!);
		assert.equal(deleteResponse.status, 204);

		const returned = await placemarkService.getAllDetails();
		assert.equal(returned.length, 0);
	});

	test("test denormalised placemark", async () => {
		const returnedDetail = await placemarkService.createDetail(concerto);
		const returnedPlacemark = await placemarkService.getPlacemark(placemark!._id!);
		assert.isNotNull(returnedPlacemark);

		const loadedDetail = await placemarkService.getDetail(returnedDetail._id!);
		assert.equal(loadedDetail.pmId, returnedPlacemark._id);
	});
});
