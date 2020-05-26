import { GatewayModemSMS, Status } from '../GatewayModemSMS'
import * as fixtures from '../__mocks__/Fixtures'

/**
 * Test file SMS
 *
 * @author Carlos Brito <carlosmcp@gmail.com>
 * @since 1.0 <2020-05-22>
 */

test.each(fixtures.statusErros)('Should throws "%p" error', (key) => {
  const status = (<any>Status)[key]
  const mockShellCommand = jest.fn().mockReturnValue(Promise.resolve(status))
  GatewayModemSMS.prototype.execShellCommand = mockShellCommand

  return new GatewayModemSMS()
    .sendMessage(fixtures.phone, fixtures.message)
    .catch(err => expect(err.status).toBe(status))
})

test('Should get "Ok" when send a message.', () => {
  const mockShellCommand = jest.fn().mockReturnValue(Promise.resolve(Status.OK))
  GatewayModemSMS.prototype.execShellCommand = mockShellCommand

  return new GatewayModemSMS()
    .sendMessage(fixtures.phone, fixtures.message)
    .catch(err => expect(err.status).toBe(Status.OK))
})
