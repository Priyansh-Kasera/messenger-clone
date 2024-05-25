'use client'
import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import { Conversation, User } from "@prisma/client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from 'react-icons/md'
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
    initialItem: FullConversationType[];
    users: User[]
}
const ConversationList: React.FC<ConversationListProps> = ({ initialItem, users }) => {
    const [items, setItems] = useState(initialItem)
    const session = useSession()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter()
    const { conversationId, isOpen } = useConversation()
    const pusherKey = useMemo(() => {
        return session.data?.user?.email
    }, [session.data?.user?.email])

    useEffect(() => {
        if (!pusherKey) {
            return;
        }
        pusherClient.subscribe(pusherKey);

        const newHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                if (find(current, { id: conversationId })) {
                    return current;
                }

                return [conversation, ...current];
            })
        }

        const updateHandler = (conversation: FullConversationType) => {
            console.log("calling the update handler", conversation.messages)
            setItems((current) => current.map((currentConversation) => {
                if (currentConversation.id === conversation.id) {
                    return {
                        ...currentConversation,
                        messages: conversation.messages

                    }
                }
                return currentConversation;
            }))
        }

        const removeHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                return [...current.filter((convo) => convo.id !== conversation.id)]
            })

            if (conversationId === conversation.id) {
                router.push('/conversations')
            }
        }

        pusherClient.bind('conversation:new', newHandler);
        pusherClient.bind('conversation:update', updateHandler)
        pusherClient.bind('conversation:remove', removeHandler)

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind('conversation:new', newHandler)
            pusherClient.unbind('conversation:update', updateHandler)
            pusherClient.unbind('conversation:remove', removeHandler)
        }
    }, [pusherKey, conversationId])
    return (
        <>
            <GroupChatModal
                users={users}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <aside className={clsx(`
        fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200
        `, isOpen ? 'hidden' : 'block w-full left-0')}
            >
                <div className="px-5">
                    <div className="flex justify-between mb-4 pt-4">
                        <div className="text-2xl font-bold text-neutral-800">Messages</div>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="rounded-full bg-gray-100 text-gray-600 cursor-pointer opacity-75 transition p-2">
                            <MdOutlineGroupAdd size={20} />
                        </div>
                    </div>
                    {items.map((item) => (
                        <ConversationBox
                            key={item.id}
                            data={item}
                            selected={conversationId === item.id}
                        />
                    ))}
                </div>
            </aside>
        </>
    )
}

export default ConversationList;