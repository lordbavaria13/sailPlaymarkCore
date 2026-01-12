import { v4 } from "uuid";
import { db } from "./store-utils.js";

export interface CommentProps {
    _id?: string;
    placemarkId: string;
    userId: string;
    username: string;
    text: string;
    rating: number;
    date: Date;
}

export const commentJsonStore = {
  async getAllComments(): Promise<CommentProps[]> {
    await db.read();
    return db.data!.comments;
  },

  async addComment(comment: CommentProps): Promise<CommentProps> {
    await db.read();
    comment._id = v4();
    comment.date = new Date();
    db.data!.comments.push(comment);
    await db.write();
    return comment;
  },

  async getCommentsByPlacemarkId(placemarkId: string): Promise<CommentProps[]> {
    await db.read();
    return db.data!.comments.filter((c) => c.placemarkId === placemarkId);
  },

  async deleteComment(id: string): Promise<void> {
    await db.read();
    db.data!.comments = db.data!.comments.filter((c) => c._id !== id);
    await db.write();
  },

  async deleteAllComments(): Promise<void> {
    await db.read();
    db.data!.comments = [];
    await db.write();
  },
};

