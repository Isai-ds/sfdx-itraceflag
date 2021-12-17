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
  public static examples = [messages.getMessage('commandExample1'),messages.getMessage('commandExample2'),messages.getMessage('commandExample3')];

  protected static requiresUsername = true;

  protected static flagsConfig = {
    entity: flags.id({
      char: 'e', 
      description: messages.getMessage('entity')    
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
    }),
    'duration': flags.minutes({
      description: messages.getMessage('duration'),
      min: 30,
      max: 1440 
    })        
  };

  public async run(): Promise<AnyJson> {
    
    try{  
      let duration = this.flags.duration ? this.flags.duration.quantity : ItraceConstants.DEFAULT_MINUTES
      await trace({
          entity: this.flags.entity,
          logtype: this.flags.logtype,
          debuglevelname: this.flags.debuglevelname,
          startdate: this.flags.startdate,
          expirationdate: this.flags.expirationdate,
          duration: duration
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
