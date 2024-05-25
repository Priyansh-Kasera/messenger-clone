"use client"
import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import React from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import { CldUploadButton } from 'next-cloudinary'


const Form = () => {
    const { conversationId } = useConversation();
    const { handleSubmit, setValue, formState: { errors }, register } = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    })

    const handleUpload = (result: any) => {
        axios.post('/api/messages', {
            image: result?.info?.secure_url,
            conversationId
        })
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true })

        axios.post('/api/messages', {
            ...data,
            conversationId: conversationId
        })

    }
    return (
        <div className='py-4 px-4 bg-white border-b flex items-center w-full gap-2 lg:gap-4'>
            <CldUploadButton
                options={{ maxFiles: 1 }}
                onUpload={handleUpload}
                uploadPreset="fupu34x7"
            >

                <HiPhoto size={30} className='text-sky-500' />
            </CldUploadButton>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex items-center gap-2 lg:gap-4 w-full'
            >
                <MessageInput
                    id="message"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Write a message"
                />
                <button
                    type='submit'
                    className='rounded-full p-2 bg-sky-500 hover:bg-sky-600 transition cursor-pointer'
                >
                    <HiPaperAirplane size={18} className='text-white' />
                </button>
            </form>
        </div>
    )
}

export default Form