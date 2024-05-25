import Image from "next/image";
import AuthForm from "./components/AuthFom";

export default function Home() {
    return (
        <div className="min-h-full flex flex-col py-12 justify-center sm:px-6 lg:px-8 bg-gray-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image
                    src={'/images/messenger.png'}
                    alt="logo"
                    height={48}
                    width={48}
                    className="mx-auto w-auto object-contain"
                />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>
            {/* Auth Form */}
            <AuthForm />
        </div>
    );
}
