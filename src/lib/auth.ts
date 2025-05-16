const apiURL = import.meta.env.VITE_BACKEND_URL

export async function login({email, password} : Login): Promise<AuthResponse> {
    const response = await fetch(`${apiURL}/mains/auth.php`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password, type: 'login'})
    })
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    return await response.json()
}

export async function register({email, password, confirmPassword, phone, upline} : Register): Promise<AuthResponse> {
    const response = await fetch(`${apiURL}/mains/auth.php`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password, type: 'register', confirmPassword, phone, upline})
    })

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    return await response.json()
}