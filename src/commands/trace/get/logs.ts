import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import {ItraceConstants} from '../../../constants'
import {logs} from '../../../main'

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages(ItraceConstants.PACKAGE_NAME, ItraceConstants.COMMAND_GET_LOG);

export default class TraceFlagGetLogs extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');
  public static examples = [messages.getMessage('commandExample1'),messages.getMessage('commandExample2'),messages.getMessage('commandExample3')];

  protected static requiresUsername = true;
  protected static flagsConfig = {
    entity: flags.string({
      char: 'e', 
      description: messages.getMessage('entity'),
      required: false
    }),
    filter: flags.string({
      char: 'f',
      description: messages.getMessage('filter'),
      required: false
    }),
    directory: flags.directory({
      char: 'd',
      description: messages.getMessage('directory'),
      required: true
    }) 
  };

  public async run(): Promise<AnyJson> {
    
    try{     
      await logs({
          entity: this.flags.entity,
          filters: this.flags.filter,
          directory: this.flags.directory
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
