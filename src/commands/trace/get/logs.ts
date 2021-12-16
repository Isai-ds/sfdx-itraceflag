import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import {ItraceConstants} from '../../../constants'
import {logs} from '../../../main'

// Initialize Messages with the current plugin directory
const messages = Messages.loadMessages(ItraceConstants.PACKAGE_NAME, ItraceConstants.COMMAND_GET_LOG);

export default class TraceFlagGetLogs extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');
  protected static requiresUsername = true;
  public static args = [{name: 'file'}];

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
