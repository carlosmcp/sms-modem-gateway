// import fs from 'fs'
// import util from 'util'
// const exec = util.promisify(child.exec)
import * as child from 'child_process'

/**
 * Main class
 *
 * @author Carlos Brito <carlosmcp@gmail.com>
 * @since 1.0 <2020-05-22>
 */

export enum Status {
  ERROR_CONFIG_NOT_FOUND = 'warning: no configuration file found',
  ERROR_DEVICE_NOT_FOUND = 'error opening device, it doesn\'t exist', // Device is connected in this port?
  ERROR_DEVICE_NOT_CONNECTED = 'probably the phone is not connected',
  ERROR_GAMMU_NOT_INSTALLED = 'gammu: not found',
  ERROR_OPEN_DEVICE_PERMISSION = 'you don\'t have the required permission', // SUDO?
  ERROR_SIM_CARD = 'failed to get smsc number from phone', // SIM CARD inserted?
  ERROR_SEND = 'waiting for network answer..error',
  ERROR_UNACKNOWLEDGED = 'error not found',
  OK = 'waiting for network answer..ok'
}

export default class GatewayModemSMS {
  private config:string = '-c ./config/gammurc.config'

  public constructor (path?:string) {
    this.config = path || this.config
  }

  /**
   * Send the SMS
   * @param phone number with country code e.g. 5511999999999
   * @param message SMS message e.g. 'Hello there!'
   */
  public sendMessage (phone:number, message: string):Promise<Status> {
    const command = `sudo gammu ${this.config} sendsms text ${phone} -text "${message}"`
    return this.execShellCommand(command)
      .then(this.checkStatus)
  }

  /**
  * Encapsulate the shell command and return it as a Promise.
  * @param cmd {string}
  * @return {Promise<string>}
  */
  private execShellCommand (cmd:string): Promise<string> {
    return new Promise((resolve) => {
      child.exec(cmd, (error, stdout, stderr) => {
        const { message } = error || {}
        resolve(stdout || stderr || message)
      })
    })
  }

  private checkStatus (message: string): Promise<Status> {
    return new Promise((resolve, reject) => {
      message = (message && message.toLowerCase()) || ''
      const statusFound = Object.entries(Status).find(([_, erroMessage]) => message.search(erroMessage) > -1)

      if (statusFound) {
        const [status] = statusFound// Enum Status key
        const enumValue:Status = (<any>Status)[status]// Convert to Enum

        enumValue === Status.OK
          ? resolve(enumValue)// sent the message
          : reject(new Error(enumValue)) // error mapped
      } else {
        reject(new Error(message || Status.ERROR_UNACKNOWLEDGED))// i don't know the error!
      }
    })
  }
}
