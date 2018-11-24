
/// <reference path="./plantuml-executor.d.ts"/>

declare module 'node-plantuml' {
    type Callback = (data?: any) => void
    interface IDoneCallback extends Callback {
        (data?: any): void
    }
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
