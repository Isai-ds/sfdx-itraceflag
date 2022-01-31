import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import {ItraceConstants} from '../../../constants'
import {deleteLogs} from '../../../main'

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages(ItraceConstants.PACKAGE_NAME, ItraceConstants.COMMAND_DELETE_LOGS);

export default class TraceFlagDeleteLogs extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');
  public static examples = [messages.getMessage('commandExample1'),messages.getMessage('commandExample2'),messages.getMessage('commandExample3')];

  protected static requiresUsername = true;
  protected static flagsConfig = {
    entity: flags.id({
      char: 'e', 
      description: messages.getMessage('entity'),
      required: false
    }),
    filter: flags.string({
      char: 'f',
      description: messages.getMessage('filter'),
      required: false
    }),
    'all': flags.boolean({
      default: false,
      description: messages.getMessage('all'),
      required: false
    }) 
  };

  public async run(): Promise<AnyJson> {
    
    try{     
      await deleteLogs({
        entity: this.flags.entity,
        filters: this.flags.filter,
        all: this.flags.all
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
