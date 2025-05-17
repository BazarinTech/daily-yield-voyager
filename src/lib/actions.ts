const apiURL = import.meta.env.VITE_BACKEND_URL

export async function getMains({userID} : CommonFetch): Promise<Mains> {
    const response = await fetch(`${apiURL}/mains/mains.php`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userID})
    })
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    return await response.json()
}

export async function makeInvestment({userID, prodID, amount} : Invest): Promise<GeneralResponse> {
    const response = await fetch(`${apiURL}/mains/invest.php`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userID, prodID, amount})
    })
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    return await response.json()
}

export async function getReturns({userID} : CommonFetch): Promise<GeneralResponse> {
    const response = await fetch(`${apiURL}/mains/returns.php`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userID})
    })
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    return await response.json()
}