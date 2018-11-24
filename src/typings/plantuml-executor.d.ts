
import { ChildProcess } from "child_process";
declare module plantUmlExecutor {
    type Callback = (data?: any) => void
    interface IDoneCallback extends Callback {
        (data?: any): void
    }
    export function useNailgun(callback: Callback): any
    export function exec(argv: any, cwd: any, callback: Callback): ChildProcess
}
