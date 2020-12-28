import { useContext, useEffect, useState } from "react"
import { FormContext } from "../FormContext"
import { FormController } from "../FormController";

export const usePending = (controller: FormController<any>) => {

    const [state, setState] = useState(() => controller.isPending());

    useEffect(() => {

        const sub = controller.on("pending", setState)

        return () => sub.unsubscribe()
    }, [controller])

    return state
}