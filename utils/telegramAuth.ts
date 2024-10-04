import crypto from 'crypto'

interface User {
    id?: string
    username?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

interface ValidatedData {
    [key: string] : string
}

interface ValidationResult {
    validateData: ValidatedData | null
    user: User
    message: string
}

export function validateTelegramWebAppData(telegramInitData: string): ValidationResult {
    const BOT_TOKEN = process.env.BOT_TOKEN

    let validateData: ValidatedData | null = null
    let user: User = {}
    let message = ''

    if (!BOT_TOKEN) {
        return { message: 'BOT_TOKEN is not set', validateData: null, user:{} }
    }

    const initData = new URLSearchParams(telegramInitData)
    const hash = initData.get('hash')

    if (!hash) {
        return{ message: 'Hash is missing from initData', validateData: null, user:{} }
    }

    initData.delete('hash')

    const authDate = initData.get('auth_date')
    if (!authDate) {
        return { message: 'auth_date is missing from initData', validateData: null, user: {} }
    }

    const authTimestamp = parseInt(authDate, 10)
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const timeDifference = currentTimestamp - authTimestamp
    const fiveMinutesInSeconds = 5 * 60

    if (timeDifference > fiveMinutesInSeconds) {
        return { message: 'Telegram data is older than 5 minutes', validateData: null, user:{} }
    }

    const dataCheckString = Array.from(initData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

    if (calculatedHash === hash) {
        validateData = Object.fromEntries(initData.entries())
        message = 'Validation Successful'
        const userString = validateData['user']
        if (userString) {
            try{
                user = JSON.parse(userString)
            }   catch (error) {
                    console.error('Error parsing user data:', error)
                    message = 'Error parsing user data'
                    validateData = null
                }
        }   else {
                message = 'User data is missing'
                validateData = null
            }
    }   else {
            message = 'Hash validaton failed'
        }
    return { validateData, user, message }
}