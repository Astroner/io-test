import { BehaviorSubject, Subscription } from 'rxjs'
import * as t from "io-ts"
import { pipe } from 'fp-ts/lib/function'
import { fold } from 'fp-ts/lib/Either'

type Extract<S extends Record<string, t.Type<any, any>>> = {
    [K in keyof S]: S[K]["_A"]
}

type OnMap<S extends Record<string, t.Type<any, any>>> = {
    change: BehaviorSubject<Partial<Extract<S>>>
    pending: BehaviorSubject<boolean>
}

export class FormController<S extends Record<string, t.Type<any, any>>>{

    private stateSubject = new BehaviorSubject<Partial<Extract<S>>>({})
    private pendingSubj = new BehaviorSubject<boolean>(false)

    private onMap: OnMap<S> = {
        change: this.stateSubject,
        pending: this.pendingSubj
    }

    constructor(
        private schema: S
    ){}

    setFieldTyped<N extends keyof Extract<S>>(name: N, value: Extract<S>[N]){
        this.setField(name + '', value)
    }

    setField(name: string, value: any) {
        const type = this.schema[name];
        if(!type) return;

        const good = pipe(
            type.decode(value),
            fold(
                () => false,
                () => true
            )
        )

        if(good) {
            const prev = this.stateSubject.getValue();
            this.stateSubject.next({
                ...prev,
                [name]: value
            })
        }
    }

    async submit(cb: (s: Extract<S>) => Promise<void> | void){
        const state = this.stateSubject.getValue();
        if(this.isFull(state)){
            const result = cb(state);
            if(result instanceof Promise) {
                this.pendingSubj.next(true)
                await result
                this.pendingSubj.next(false)
            }
        }
    }

    on<K extends keyof OnMap<S>>(
        event: K,
        handler: (value: OnMap<S>[K]["value"]) => void
    ): Subscription {
        return (this.onMap[event] as any).subscribe(handler)
    }

    getValue(){
        return this.stateSubject.getValue()
    }

    isPending(){
        return this.pendingSubj.getValue();
    }

    asObservable(){
        return this.stateSubject.asObservable()
    }

    private isFull(state: any): state is Extract<S> {
        const type = t.type(this.schema);
        const decoded = type.decode(state);
        return pipe(
            decoded,
            fold(
                () => false,
                () => true
            )
        )
    }

}
