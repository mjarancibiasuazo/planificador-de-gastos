import { useReducer, createContext, Dispatch, ReactNode, useMemo } from "react"
import { BudgetActions, BudgetState, budgetReducer, initialState } from "../reducers/budget-reducer"

type BudgetContextProps = {
    state: BudgetState
    dispatch: Dispatch<BudgetActions>
    totalExpenses: number
    remainingBudget: number
}

type BudgetProviderProps = {
    children: ReactNode
} 

export const BudgetContext = createContext<BudgetContextProps>(null!)

//Con el provider tenemos acceso al reducer y a las funciones del reducer.
//Sintaxis para poder tener acceso al reducer y a las acciones.
export const BudgetProvider = ({ children } : BudgetProviderProps) => {

    const [state, dispatch] = useReducer(budgetReducer, initialState)

     //TOTAL DEL PRESUPUESTO MENOS LOS GASTOS
     const totalExpenses = useMemo( () => state?.expenses.reduce(( total, expense) => expense.amount + total, 0) ?? 0, [ state?.expenses ]) 

     //LO QUE QUEDA DEL PRESUPUESTO
     const remainingBudget = (state?.budget ?? 0) - totalExpenses;

    return (
        <BudgetContext.Provider
            value={{
                state:  state ?? initialState,
                dispatch,
                totalExpenses,
                remainingBudget
            }}
        > 
            {children}
        </BudgetContext.Provider>
    )
}
