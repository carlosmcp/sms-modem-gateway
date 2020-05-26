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
      ERROR_UNACKNOWLEDGED = 'Error not found',
      ERROR_DEVICE_NOT_FOUND = 'Error opening device',
      ERROR_DEVICE_NOT_CONNECTED = 'Probably the phone is not connected.',
      ERROR_CONFIG_NOT_FOUND = 'Warning: No configuration file found!',
      ERROR_SEND = 'waiting for network answer..error',
      OK = 'waiting for network answer..OK'
}

export class GatewayModemSMS {
  /**
   * Send the SMS
   * @param phone number with country code e.g. 5511999999999
   * @param message SMS message e.g. 'Hello there!'
   */
  public sendMessage (phone:number, message: string):Promise<Status> {
    const command = `gammu sendsms text ${phone} -text "${message}" `
    return this.execShellCommand(command)
      .then(this.extractMessage)
  }

  /**
  * Encapsulate the shell command and return it as a Promise.
  * @param cmd {string}
  * @return {Promise<string>}
  */
  public execShellCommand (cmd:string): Promise<string> {
    return new Promise((resolve, reject) => {
      child.exec(cmd, (error, stdout, stderr) => {
        const { message } = error || {}
        stdout ? resolve(stdout || stderr) : reject(message)// get the main command's error
      })
    })
  }

  private extractMessage (message: string): Promise<Status> {
    return new Promise((resolve, reject) => {
      const [result] = Object.entries(Status).find(([_, value]) => message.search(value) === 0)
      const enumValue:Status = (<any>Status)[result]
      const error:any = new Error(message)
      error.status = enumValue
      enumValue === Status.OK ? resolve(enumValue) : reject(error)
    })
  }
}
