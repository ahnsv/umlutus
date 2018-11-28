import { Type, Modifier } from "typescript";

interface IElement {
    stereotype?: string
    abstract?: boolean
    className: string
    property?: string[]
    propertyModifier?: Modifier[]
    propertyReturnType?: Type[]
    method?: string[]
    methodModifier?: Modifier[]
    methodParameterType: Type[]
    methodReturnType: Type[]
}

export function generalizationTemplate(): string { }
export function realizationTemplate(): string { }
export function dependencyTemplate(): string { }
export function associationTemplate(): string { }
export function compositionTemplate(): string { }
export function aggregationTemplate(): string { }
export function reflexiveTemplate(): string { }
export function multiplicityTemplate(): string { }
