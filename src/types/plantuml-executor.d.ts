import { Callback, IDoneCallback } from './interfaces'
import { ChildProcess } from 'child_process';

declare module plantUmlExecutor {
    export function useNailgun(callback: Callback): any
    export function exec(argv: any, cwd: any, callback: Callback): ChildProcess
}
