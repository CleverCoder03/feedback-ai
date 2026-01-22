import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(request: Request, props: {params: Promise<{id: string}>}) {
  const params = await props.params;
  const messageId = params.id
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  try {
    console.log("User ID:", user._id);
  console.log("Message ID to delete:", messageId);
    const updateResult = await UserModel.updateOne({
        _id: user._id
    }, {
        $pull: {message: {_id: messageId}}
    })
    if (updateResult.modifiedCount === 0) {
        return Response.json(
      {
        success: false,
        message: "Message not found or could not be deleted",
      },
      { status: 404 }
    );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
