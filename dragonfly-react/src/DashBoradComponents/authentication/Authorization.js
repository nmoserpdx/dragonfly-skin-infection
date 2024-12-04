import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import { Redirect } from 'react-router'

const Authorization = () => {
    const {user, isLoading} = useAuth0()
    return (
        <div>
            {!isLoading && !user && <Redirect to = '/login' />}
            {!isLoading && user && <Redirect to='/profile' />}
        </div>
    )
}

export default Authorization
