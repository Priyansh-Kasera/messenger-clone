'use client'
import useActiveChannel from '@/app/hooks/useActiveChannel'
import React from 'react'

const ActiveStatus = () => {
    useActiveChannel();
    return (
        <div>ActiveStatus</div>
    )
}

export default ActiveStatus