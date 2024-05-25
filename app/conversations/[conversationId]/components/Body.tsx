"use client"
import useConversation from '@/app/hooks/useConversation'
import { FullMessageType } from '@/app/types'
import React, { useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox'
import axios from 'axios'
import { pusherClient } from '@/app/libs/pusher'
import { find } from 'lodash'
interface BodyProp {
    initialMessages: FullMessageType[]
}
const Body: React.FC<BodyProp> = ({ initialMessages }) => {
    const [messages, setMessages] = useState(initialMessages)
    const bottomRef = useRef<HTMLDivElement>(null)
    const { conversationId } = useConversation()

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`)
    }, [conversationId])

    useEffect(() => {
        pusherClient.subscribe(conversationId);
        bottomRef?.current?.scrollIntoView()

        const messageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`)
            setMessages((current) => {
                if (find(current, { id: message.id })) {
                    return current;
                }
                return [...current, message]
            })
            bottomRef?.current?.scrollIntoView()

        }

        const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((current) => current.map((curretMessage) => {
                if (curretMessage.id === newMessage.id) {
                    return newMessage;
                }
                return curretMessage;
            }))
        }

        pusherClient.bind('messages:new', messageHandler);
        pusherClient.bind('message:update', updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind('messages:new', messageHandler);

        }
    }, [conversationId])

    return (
        <div className='flex-1 overflow-y-auto'>
            {
                messages.map((message, i) => (
                    <MessageBox data={message} isLast={i === messages.length - 1} key={i} />
                ))
            }
            <div
                ref={bottomRef}
                className='pt-24'
            />

        </div>
    )
}

export default Body