export class ITraceError extends Error{
    constructor (message: string){
        super(message);
        Object.setPrototypeOf(this,ITraceError.prototype)
    }
}