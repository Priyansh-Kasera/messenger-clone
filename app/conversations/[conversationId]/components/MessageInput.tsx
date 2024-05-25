"use client"
import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
interface MessageInputProp {
    required?: boolean,
    placeholder?: string;
    id: string;
    type?: string;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors
}
const MessageInput: React.FC<MessageInputProp> = ({ type, required, id, errors, placeholder, register }) => {
    return (
        <div className='relative w-full'>
            <input
                id={id}
                type={type}
                autoComplete={type}
                {...register(id, { required })}
                placeholder={placeholder}
                className='text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none'
            />
        </div>
    )
}

export default MessageInput