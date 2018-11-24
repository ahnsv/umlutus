export type Callback = (data?: any) => void
export interface IDoneCallback extends Callback {
    (data?: any): void
}
