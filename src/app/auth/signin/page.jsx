'use client'
import React, { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const Page = () => {
    const Router = useRouter()
    const { status } = useSession()
    useEffect(() => {
        if (status === "unauthenticated") {
            void signIn("google")
        }
        else {
            Router.push("/dashboard")
        }
    }, [status])
    return (
        <>

        </>
    )
}

export default Page