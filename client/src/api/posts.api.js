import api from "./axios";

export const getFeed = (page = 1, limit = 20) =>
  api.get("/post/feed", { params: { page, limit } }).then((r) => r.data);

export const getExplore = (page = 1, limit = 20) =>
  api.get("/post/explore", { params: { page, limit } }).then((r) => r.data);

export const getPostById = (id) =>
  api.get(`/post/${id}`).then((r) => r.data);

export const createPost = (data) =>
  api.post("/post", data).then((r) => r.data);

export const updatePost = (id, data) =>
  api.put(`/post/${id}`, data).then((r) => r.data);

export const deletePost = (id) =>
  api.delete(`/post/${id}`).then((r) => r.data);

export const updateLike = (id) =>
  api.post(`/post/${id}/react`).then((r) => r.data);

export const createComment = (postId, data) =>
  api.post(`/post/${postId}/comments`, data).then((r) => r.data);

export const deleteComment = (postId, commentId) =>
  api.delete(`/post/${postId}/comments/${commentId}`).then((r) => r.data);
