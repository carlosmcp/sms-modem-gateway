/**
 * Fixtures test
 *
 */
import { Status } from '../GatewayModemSMS'

export const phone = 5511999999999
export const statusErros = [{
  status: Status.ERROR_CONFIG_NOT_FOUND,
  message: 'Warning: No configuration file found! Warning: No configuration read, using builtin defaults! Error opening device, it doesn\'t exist.'
}, {
  status: Status.ERROR_DEVICE_NOT_FOUND,
  message: 'Error opening device, it doesn\'t exist'
},
{
  status: Status.ERROR_GAMMU_NOT_INSTALLED,
  message: '/bin/sh: 1: gammu: not found'
},
{
  status: Status.ERROR_OPEN_DEVICE_PERMISSION,
  message: 'Error opening device, you don\'t have the required permission'
},
{
  status: Status.ERROR_SIM_CARD,
  message: 'failed to get smsc number from phone'
},
{
  status: Status.ERROR_SEND,
  message: 'waiting for network answer..error'
},
{
  status: Status.ERROR_UNACKNOWLEDGED,
  message: ''
}]

export const message = 'Hello there!'
export const infraErroMessage = 'unknow error'
