'use client';

import Button from "@/app/components/Button";
import Input from "@/app/components/input/Input";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import nextAuth from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Varient = 'LOGIN' | 'REGISTER'

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [varient, setVarient] = useState<Varient>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.push('/users')
        }
    }, [session?.status, router])

    const toggleVarient = useCallback(() => {
        if (varient === 'LOGIN') {
            setVarient('REGISTER')
        } else {
            setVarient('LOGIN')
        }
    }, [varient])

    const { register, handleSubmit, formState } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    });
    const { errors } = formState

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        if (varient === 'REGISTER') {
            axios.post('/api/register', data)
                .then(() => signIn('credentials', data))
                .catch(() => toast.error("Something went wrong!"))
                .finally(() => setIsLoading(false))
        }
        if (varient === 'LOGIN') {
            // NextAuth login
            signIn('credentials', {
                ...data,
                redirect: false
            })
                .then((callback) => {
                    if (callback?.error) {
                        toast.error('Invalid credentials.')
                    }
                    if (callback?.ok && !callback?.error) {
                        toast.success('Logged in!')
                        router.push('/users')
                    }
                })
                .finally(() => setIsLoading(false))
        }
    }

    const socialAction = (action: string) => {
        setIsLoading(true);
        // NextAuth social sign In
        signIn(action, {
            redirect: false
        })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentails.')
                }
                if (callback?.ok && !callback?.error) {
                    toast.success('Logged in!')
                }
            })
            .finally(() => setIsLoading(false))
    }
    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 shadow px-4 sm:rounded-lg sm:px-10">
                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {
                        varient === 'REGISTER' && (
                            <Input
                                id="name"
                                label="name"
                                register={register}
                                errors={errors}
                                disabled={isLoading}
                            />
                        )
                    }
                    <Input
                        id="email"
                        label="Email address"
                        register={register}
                        errors={errors}
                        type="email"
                        disabled={isLoading}
                    />
                    <Input
                        id="password"
                        label="Password"
                        register={register}
                        errors={errors}
                        type="password"
                        disabled={isLoading}

                    />

                    <div>
                        <Button
                            disabled={isLoading}
                            fullWidth
                            type="submit"
                        >
                            {
                                varient === 'REGISTER' ? 'Register' : 'Sign in'
                            }
                        </Button>
                    </div>

                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => { socialAction('github') }}
                        />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => { socialAction('google') }}
                        />
                    </div>
                </div>
                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    <div>
                        {
                            varient === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'
                        }
                    </div>
                    <div
                        onClick={toggleVarient}
                        className="underline cursor-pointer ">
                        {
                            varient === 'LOGIN' ? 'Create an account' : 'Login'
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthForm;