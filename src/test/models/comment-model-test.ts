import { assert } from "chai";
import { db } from "../../models/db.js";
import { maggie, testPlacemark } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Comment Model tests", () => {
    
    setup(async () => {
        await db.init("mongo");
        await db.commentStore!.deleteAllComments();
        await db.placemarkStore!.deleteAllPlacemarks();
        await db.userStore!.deleteAllUsers();
    });

    test("create a comment", async () => {
        const user = await db.userStore!.addUser(maggie);
        const placemark = await db.placemarkStore!.addPlacemarks({ ...testPlacemark, userId: user._id! });
        if (!placemark) {
            assert.fail("Placemark was not created");
        }
        const comment = {
            placemarkId: placemark._id!,
            userId: user._id!,
            username: user.username,
            text: "Great place!",
            rating: 5,
            date: new Date()
        };
        const newComment = await db.commentStore!.addComment(comment);
        assertSubset(comment, newComment);
        assert.isDefined(newComment._id);
    });

    test("get comments by placemark id", async () => {
        const user = await db.userStore!.addUser(maggie);
        const placemark = await db.placemarkStore!.addPlacemarks({ ...testPlacemark, userId: user._id! });
        if (!placemark) {
            assert.fail("Placemark was not created");
        }
        const comment = {
            placemarkId: placemark._id!,
            userId: user._id!,
            username: user.username,
            text: "Great place!",
            rating: 5,
            date: new Date()
        };
        await db.commentStore!.addComment(comment);
        const comments = await db.commentStore!.getCommentsByPlacemarkId(placemark._id!);
        assert.equal(comments.length, 1);
        assertSubset(comment, comments[0]);
    });

     test("delete comment", async () => {
        const user = await db.userStore!.addUser(maggie);
        const placemark = await db.placemarkStore!.addPlacemarks({ ...testPlacemark, userId: user._id! });
        if (!placemark) {
            assert.fail("Placemark was not created");
        }
        const comment = {
            placemarkId: placemark._id!,
            userId: user._id!,
            username: user.username,
            text: "Great place!",
            rating: 5,
            date: new Date()
        };
        const newComment = await db.commentStore!.addComment(comment);
        await db.commentStore!.deleteComment(newComment._id!);
        const comments = await db.commentStore!.getCommentsByPlacemarkId(placemark._id!);
        assert.equal(comments.length, 0);
    });
});
