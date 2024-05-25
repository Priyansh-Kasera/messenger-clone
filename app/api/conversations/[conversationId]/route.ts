import getCurrentUser from "@/app/action/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const existingCoversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingCoversation) {
      return new NextResponse("Invalid Id", { status: 400 });
    }

    const deleteConveration = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingCoversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:remove",
          existingCoversation
        );
      }
    });

    return NextResponse.json(deleteConveration);
  } catch (err: any) {
    console.log(err, "ERROR_CONVERSATION_DELETE");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
