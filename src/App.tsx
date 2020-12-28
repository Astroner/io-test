import * as t from 'io-ts'
import * as React from 'react'
import FieldConsumer from './lib/components/FieldConsumer'
import FormProvider from './lib/components/FormProvider'
import { useController } from './lib/hooks/useController'
import { usePending } from './lib/hooks/usePending'

export interface IApp {}

const delay = (delay: number) => new Promise(resolve => {
    setTimeout(resolve, delay)
})

const App: React.FC<IApp> = () => {

    const [controller, submit] = useController(
        () => ({
            name: t.string
        }),
        async data => {
            await delay(3000)
            console.log(data)
        }
    )
    
    const isPending = usePending(controller);

    return (
        <FormProvider controller={controller} >
            {isPending ? "LOADING..." : "READY"}
            <FieldConsumer name="name">
                {({ value, setValue }) => (
                    <input value={value} onChange={e => setValue(e.target.value)} />
                )}
            </FieldConsumer>
            <button onClick={submit}>
                click
            </button>
        </FormProvider>
    )
}

export default App