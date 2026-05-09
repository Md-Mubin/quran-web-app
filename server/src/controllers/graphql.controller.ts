import { Request, Response } from "express";
import fetch from "node-fetch";

export const graphqlQuery = async (req: Request, res: Response) => {
  try {
    const { query, variables, operationName } = req.body;
    const response = await fetch(process.env.BACKEND_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables, operationName }),
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message || "Server Error" });
  }
};
