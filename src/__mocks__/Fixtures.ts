import { Status } from '../GatewayModemSMS'

export const phone = 11999999999
export const statusErros = Object.keys(Status).filter(item => item !== 'OK')
export const message = 'Hello there!'
