import { Comment } from "./comment.js";
import { CommentProps } from "../json/comment-json-store.js";

export const commentMongoStore = {
  async getAllComments(): Promise<CommentProps[]> {
    const comments = await Comment.find().lean();
    return comments as unknown as CommentProps[];
  },

  async addComment(comment: CommentProps): Promise<CommentProps> {
    const { v4 } = await import("uuid");
    if (!comment._id) comment._id = v4();
    const newComment = new Comment(comment);
    const commentObj = await newComment.save();
    return commentObj as unknown as CommentProps;
  },

  async getCommentsByPlacemarkId(placemarkId: string): Promise<CommentProps[]> {
    const comments = await Comment.find({ placemarkId }).lean();
    return comments as unknown as CommentProps[];
  },

  async deleteComment(id: string): Promise<void> {
    await Comment.deleteOne({ _id: id });
  },

  async deleteAllComments(): Promise<void> {
    await Comment.deleteMany({});
  },
};

