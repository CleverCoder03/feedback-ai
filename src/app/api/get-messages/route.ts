import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const userAggregate = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$message" },
      { $sort: { "message.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$message" } } },
    ]);

    if (!userAggregate || userAggregate.length === 0) {
      // If the aggregation returns nothing, it usually means the user has no messages
      // (due to the $unwind stage filtering out documents with empty arrays)
      return Response.json(
        {
          success: false,
          message: "No messages found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: userAggregate[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting messages", error);
    return Response.json(
      {
        success: false,
        message: "Error fetching messages",
      },
      { status: 500 }
    );
  }
}