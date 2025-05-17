import { getMains, getReturns } from '@/lib/actions'
import React, { createContext, useContext, useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
}

type Auth = {
    userID: number | null,
    isLogged: boolean,
    mains: Mains | null
    loginA: (userID: number) => void,
    logout: () => void,
    mainFetcher: (userID: number) => void,
}

export const AuthContext = createContext<Auth | null>(null)

function AuthProvider({children}: Props) {
    const [userID, setUserID] = useState<number | null>(null)
    const [isLogged, setIsLogged] = useState(true)
    const [mains, setMains] = useState<Mains | null>(null)

    const mainFetcher = async (userID:number) => {
        try {
            const results  = await getMains({userID})
            const returns = await getReturns({userID})
            setMains(results)
        } catch (error) {
            console.error('mains Fetch error:', error)
        }
    }

    const loginA = (userID: number) => {
        mainFetcher(userID)
        setUserID(userID)
        setIsLogged(true)   
    }

    const logout = () => {
        setUserID(null)
        setIsLogged(false)
        setMains(null)
        localStorage.removeItem('xghduuyjuyafv')
    }

    useEffect(() => {
        const savedID = localStorage.getItem('xghduuyjuyafv')
        if (savedID) {
            loginA(JSON.parse(savedID))
        }else{
            setIsLogged(false)
        }
    }, [])

    const values: Auth = {
        userID,
        isLogged,
        mains,
        loginA,
        logout,
        mainFetcher
    }

  return (
    <AuthContext.Provider value={values}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) { throw new Error('useAuth must be used within AuthProvider') }
    return context
}

export default AuthProvider