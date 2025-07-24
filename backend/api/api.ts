import Alert from "../models/schema";
import connectDB from "./connectdb";

export default async function handler(req : any, res : any) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();

  const { email, coin, targetPrice } = req.body;

  try {
    const alert = new Alert({ email, coin, targetPrice });
    await alert.save();
    res.status(200).json({ message: "Alert saved!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save alert", error: err });
  }
}
