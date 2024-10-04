'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TelegramAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const response = await fetch('/api/session')
        if (response.ok) {
            setIsAuthenticated(true)
        }
    }

    const authenticateUser = async () => {
        const WebApp = (await import('@twa-dev/sdk')).default
        WebApp.ready()
        const initData = WebApp.initData
        if (initData) {
            try {
                const response = await fetch('/api/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ initData }),
                })
                if (response.ok) {
                    setIsAuthenticated(true)
                    router.refresh()
                }   else {
                        console.error('Authentication failed')
                        setIsAuthenticated(false)
                    }
            }
            catch (error) {
                console.error('Error during authentication:', error)
                setIsAuthenticated(false)
            }
        }
    }
    return (
        <div>
            {isAuthenticated ? (
                <>
                    <p>Authenticated !</p>
                    <button onClick={() => router.push('/protected')}>
                        CLICK TO START FARMING
                    </button>
                </>
            ) : (
                <div>
                    <p> SORRY FOR THE ERROR</p>
                    <button onClick={authenticateUser}>
                        Authenticate
                    </button>
                </div>
            )}
        </div>
    )
}