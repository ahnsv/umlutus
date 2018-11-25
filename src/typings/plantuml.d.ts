
/// <reference path="./plantuml-executor.d.ts"/>
declare module 'node-plantuml' {
    import { ChildProcess } from 'child_process';
    type Callback = (data?: any) => void
    interface IDoneCallback extends Callback {
        (data?: any): void
    }
    interface IInOut {
        in: ChildProcess["stdin"]
        out: ChildProcess["stdout"]
    }
    interface IOut {
        out: ChildProcess["stdout"]
    }
    export function useNailgun(callback: Callback): any
    export function generate(input: string, options?: Object, callback?: Callback): IOut
    export function encode(input: string, options: Object, callback: Callback): IOut
    export function decode(encoded: string, callback: Callback): IOut
    export function testdot(callback: Callback): IOut
    export interface PlantumlEncodeStream {
        chunks: any[]
        _transform(chunk: any[], encoding: any, done: IDoneCallback): void
        _flush(done: IDoneCallback): void
    }
}
