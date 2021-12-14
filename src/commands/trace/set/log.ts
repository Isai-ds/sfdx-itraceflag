import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import {trace} from '../../../main'
import {ItraceConstants} from '../../../constants'

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

const messages = Messages.loadMessages(ItraceConstants.PACKAGE_NAME, ItraceConstants.COMMAND_SET_LOG);

export default class TraceFlagLog extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');
  protected static requiresUsername = true;
  public static args = [{name: 'file'}];

  protected static flagsConfig = {
    entity: flags.id({
      char: 'e', 
      description: messages.getMessage('entity'),
      required: false
    }),
    logtype: flags.enum({
      char: 'l',
      description: messages.getMessage('logType'),
      options: ['user','developer'],
      default:'user'
    }),
    startdate: flags.datetime({
      char: 's',
      description: messages.getMessage('startDate')
    }),
    expirationdate: flags.datetime({
      char: 'x',
      description: messages.getMessage('expirationDate')
    }),
    debuglevelname: flags.string({
      char: 'd',
      description: messages.getMessage('debugLevelName'),
      default: 'SFDC_DevConsole'
    })    
  };

  public async run(): Promise<AnyJson> {
    
    try{
     
     await trace({
          entity: this.flags.entity,
          logtype: this.flags.logtype,
          debuglevelname: this.flags.debuglevelname,
          startdate: this.flags.startdate,
          expirationdate: this.flags.expirationdate
        },
        this.org,
        this.ux
      )
    } catch (error){
      throw new SfdxError(error.message);
    }
    
    // Return an object to be displayed with --json
    return null
  }
}
