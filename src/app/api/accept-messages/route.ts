import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessage,
      },
      { new: true }
    );

    if(!updatedUser){
        return Response.json(
            {
                success: false,
                message: "User not found"
            }, {status: 404}
        )
    }

    return Response.json(
            {
                success: true,
                message: "Accepting mesage status updated"
            }, {status: 200}
        )
  } catch (error) {
    console.error("Failed to update message status", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update message status",
      },
      { status: 500 }
    );
  }
}


export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId)
  
    if(!foundUser) {
      return Response.json({
          success: false,
          message: "User not found"
      }, {status: 404})
    }
  
    return Response.json({
          success: true,
          isAcceptingMessages: foundUser.isAcceptingMessages
      }, {status: 200})
  
  } catch (error) {
    console.error("Error while getting status", error)
    return Response.json({
          success: false,
          message: "Error while getting status"
      }, {status: 500})
  }
}