import * as React from 'react'
import { FormContext } from '../FormContext';
import { FormController } from '../FormController';

export interface IFormProvider {
    controller: FormController<any>
    children?: React.ReactNode
}

const FormProvider: React.FC<IFormProvider> = (props) => {
    return(
        <FormContext.Provider value={props.controller}>
            {props.children}
        </FormContext.Provider>
    )
}

export default FormProvider