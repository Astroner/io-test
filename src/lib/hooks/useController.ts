import * as t from "io-ts"
import * as React from 'react'
import { FormController } from "../FormController"

type ArrReturn<S extends Record<string, t.Type<any, any>>> = [FormController<S>, VoidFunction] & {
    controller: FormController<S>,
    submit: VoidFunction
}

export const useController = <S extends Record<string, t.Type<any, any>>>(
    createSchema: () => S,
    sb?: Parameters<FormController<S>["submit"]>[0],
    dependencies?: any[]
): ArrReturn<S> => {

    const controller = React.useMemo(() => {
        return new FormController(createSchema())
    }, [])

    const submit = React.useCallback(() => {
        sb && controller.submit(sb)
    }, dependencies ?? []);
    
    const rt = React.useMemo<ArrReturn<S>>(() => {
        return Object.assign(
            [controller, submit] as [FormController<S>, VoidFunction],
            {
                controller,
                submit
            }
        )
    }, [])

    return rt
}