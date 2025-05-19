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

export async function claimBonus({userID, bonusID} : ClaimBonus): Promise<GeneralResponse> {
    const response = await fetch(`${apiURL}/mains/bonus.php`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userID, bonusID})
    })
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    return await response.json()
}

export async function updateAccount({userID, email, phone} : ModifyAccount): Promise<GeneralResponse> {
    const response = await fetch(`${apiURL}/mains/account.php`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userID, email, phone, type: 'account'})
    })
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    return await response.json()
}

export async function updatePassword({userID, oldPassword, newPassword, confirmPassword} : ModifyAccount): Promise<GeneralResponse> {
    const response = await fetch(`${apiURL}/mains/account.php`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userID, oldPassword, newPassword, confirmPassword, type: 'password'})
    })
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    return await response.json()
}

export async function deposit({userID, amount, account} : Transact): Promise<GeneralResponse> {
    const response = await fetch(`${apiURL}/mains/deposit.php`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userID, amount, account})
    })
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    return await response.json()
}

export async function withdraw({userID, amount, account} : Transact): Promise<GeneralResponse> {
    const response = await fetch(`${apiURL}/mains/withdraw.php`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userID, amount, account})
    })
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    return await response.json()
}