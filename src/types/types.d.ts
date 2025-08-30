type GeneralResponse = {
    status: string,
    message?: string,
}

type AuthResponse = GeneralResponse & {
    userID?: number,
    error: {
        input: string
    }[]
}

type Register = {
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    type: string,
    upline: string,
    name:string,
    username:string
}

type Login = {
    email: string,
    password: string
    type: string
}

type User = {
    email: string,
    phone: string,
    date_joined: string
    status: string,
    upline: string,
    ID?: string,
    date_created?: string
}

type Wallet = {
    balance: number,
    total_deposits: number,
    total_withdrawals: number,
    income: number,
    invite_income: number,
    status: string
}
type InvestmentOrder = {
    ID: number,
    product_name: string,
    product_price: number,
    duration: number,
    status: string,
    amount: number,
    investment_date: string,
    total_returns: number,
    return_rate: number,
    remaining: number
}

type Bonus = {
    ID: number,
    name: string,
    type: string,
    reward: string,
    is_claimed: boolean,
    target: number
    status: string,
    time: string,
    reward_type: string,
    progress: number
}

type Product = {
    ID: string,
    name: string,
    returns: number,
    min: number,
    max: number,
    status: string,
    duration: number,
    description: string,
    tier: string
    riskLevel: number
}

type Transactions = {
    ID: string,
    type: string,
    amount: number,
    time: string,
    status: string
    description: string
    fees: number
}

type Mains = {
    user: User,
    wallet: Wallet,
    referral: {
        downlines: User[],
        total_downlines: number,
        active_downlines: number,
    }
    products: Product[],
    user_investments: InvestmentOrder[],
    bonuses: Bonus[],
    transactions: Transactions[],
    active_investment: string,
    average_return: string
}

type CommonFetch = {
    userID: number
}

type Invest = CommonFetch & {
    prodID: string
    amount: number
}

type ClaimBonus = CommonFetch & {
    bonusID: number
}

type ModifyAccount = {
    userID: number,
    email?: string,
    phone?: string,
    oldPassword?: string,
    newPassword?: string
    confirmPassword?: string,
}

type Transact = {
    userID: number,
    amount: string,
    account: string
}
