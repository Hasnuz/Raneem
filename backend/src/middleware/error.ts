import type { ErrorRequestHandler } from "express";
export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  void next;
  console.error(err);
  res.status(500).json({ error: "The request could not be completed" });
};
