import GatewayModemSMS, { Status } from '../GatewayModemSMS'
import * as fixtures from '../__mocks__/Fixtures'
const childProcess = require('child_process')// Warning: If we want to mock Node's core modules (e.g.: fs or path), then explicitly calling e.g. jest.mock('path') is required, because core Node modules are not mocked by default. {@see https://jestjs.io/docs/en/manual-mocks#mocking-node-modules}

/**
 * Test file SMS
 *
 * @author Carlos Brito <carlosmcp@gmail.com>
 * @since 1.0 <2020-05-22>
 */

beforeAll(() => {
  jest.mock('child_process')
  jest.setTimeout(10000)// depends on the type of test
})

test.each(fixtures.statusErros)('Should throws "%p" mapped error', ({ status, message }) => {
  const mockShellCommand = jest.fn().mockImplementation((command, callback) => callback(null, message))
  childProcess.exec = mockShellCommand

  return new GatewayModemSMS()
    .sendMessage(fixtures.phone, fixtures.message)
    .catch((err:Error) => expect(err.message).toBe(status))
})

test('Should send Status "OK" when send a message with success!', () => {
  const mockShellCommand = jest.fn().mockImplementation((_command, callback) => callback(null, Status.OK))
  childProcess.exec = mockShellCommand

  return new GatewayModemSMS()
    .sendMessage(fixtures.phone, fixtures.message)
    .then(result => expect(result).toBe(Status.OK))
})

test('Should catch unknown error when send a message', () => {
  const mockShellCommand = jest.fn().mockImplementation((_command, callback) => callback(new Error('unknow error'), null, null))
  childProcess.exec = mockShellCommand

  return new GatewayModemSMS()
    .sendMessage(fixtures.phone, fixtures.message)
    .catch(error => {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe(fixtures.infraErroMessage)
    })
})
