import { Callback, IDoneCallback } from './interfaces'
import * as plantumlExecutor from './plantuml-executor';

declare module plantUml {
    export function useNailgun(callback: Callback): any
    export function generate(input: string, options: Object, callback: Callback): string
    export function encode(input: string, options: Object, callback: Callback): string
    export function decode(encoded: string, callback: Callback): string
    export function testdot(callback: Callback): string
    export interface PlantumlEncodeStream {
        _transform(chunk: any[], encoding: any, done: IDoneCallback): void
        _flush(done: IDoneCallback): void
    }
}

export default plantUml