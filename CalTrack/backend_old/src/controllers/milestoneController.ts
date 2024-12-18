import { Request, Response } from "express";

export const createMilestone = (req: Request, res: Response) => {
  const { name, description, goalDate } = req.body;

  res.status(201).json({ message: "Milestone created successfully" });
};

export const getMilestones = (req: Request, res: Response) => {
  res.status(200).json({ milestones: [] });
};

export const updateMilestone = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, goalDate } = req.body;

  res.status(200).json({ message: "Milestone updated successfully" });
};
