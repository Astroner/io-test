import * as React from 'react'
import { FormContext } from '../FormContext'

export interface IFieldConsumer {
    name: string
    children: (
        arg: {
            value: any,
            setValue: (next: any) => void
        }
    ) => React.ReactNode
}

const FieldConsumer: React.FC<IFieldConsumer> = (props) => {

    const ctx = React.useContext(FormContext);

    const [value, setValue] = React.useState<any>(ctx.getValue()[props.name])

    React.useEffect(() => {
        const sub = ctx.on("change", data => {
            setValue(data[props.name])
        })

        return () => sub.unsubscribe()
    }, [props.name, ctx])

    const change = React.useCallback((next: any) => {
        ctx.setField(props.name, next)
    }, [props.name, ctx])

    const res = props.children({
        value,
        setValue: change
    })

    return (
        <>
            {res}
        </>
    )
}

export default FieldConsumer