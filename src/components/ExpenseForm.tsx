import { ChangeEvent, useEffect, useState } from "react";
import type { DraftExpense, Value } from "../types";
import { Select } from "@headlessui/react";
import { categories } from "../data/categories";
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";


export default function ExpenseForm() {

    const [ expense, setExpense ] = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    })

    const [ error, setError ] = useState('')
    const [ previousAmount, setPreviousAmount ] = useState(0)
    const { dispatch, state, remainingBudget } = useBudget()

    useEffect(() => {
        if( state.editingId ) {
            const editingExpense = state.expenses.filter( currenteExpense => currenteExpense.id === state.editingId )[0]
            setExpense( editingExpense )
        }
    }, [state.editingId])

   const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const isAmountField = ['amount'].includes(name)

       setExpense({
           ...expense,
           [name]: isAmountField ? +value : value
       })
    }

    //Función para el DatePicker
    const handleChangeDate = (value : Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        //VALIDAR FORMULARIO
        if(Object.values(expense).includes('')){
            setError('Todos los campos son obligatorios')
            return
        }

        //QUE NO ME PASE DEL LIMITE O PRESUPUESTO
        if(  (expense.amount - previousAmount ) > remainingBudget ){
            setError('No puede superar el presupuesto restante')
            return
        }

        //AGREGAR UN NUEVO GASTO O ACTUALIZAR EL GASTO
        if( state.editingId ) {
            dispatch({ type: 'update-expense', payload: { expense: { id: state.editingId, ...expense }} })
        } else {
            
            dispatch({ type: 'add-expense', payload: { expense } })
        }
       

        //REINICIAR EL STATE
        setExpense({
            amount: 0,
            expenseName: '',
            category: '',
            date: new Date()
        })
        setPreviousAmount(0)
    }

  return (
    <form className="space-y-5" onSubmit={ handleSubmit }>
        <legend
        className="uppercase text-center text-2xl font-black border-b-4 
        border-blue-500 py-2"
        >{ state.editingId ? 'Actualizar Gasto' : 'Nuevo Gasto' }
            
        </legend>

        { error && <ErrorMessage>{ error }</ErrorMessage> }

    <div className="flex flex-col gap-2">
        <label
            htmlFor="expenseName"
            className="text-xl"
        >
            Nombre Gasto: </label>

        <input
            type="text"
            id="expenseName"
            placeholder="Añade el nombre del Gasto"
            className="bg-slate-100 p-2"
            name="expenseName"
            value={ expense.expenseName }
            onChange={ handleChange }
        />
    <label
            htmlFor="amount"
            className="text-xl"
        >
            Cantidad: </label>

        <input
            type="number"
            id="amount"
            placeholder="Añade la cantidad del Gasto: ej. 300"
            className="bg-slate-100 p-2"
            name="amount"
            value={ expense.amount }
            onChange={ handleChange }
        />

    <label
            htmlFor="category"
            className="text-xl"
        >Categoria: </label>

        <Select
            id="category"
            className="bg-slate-100 p-2"
            name="category"
            value={ expense.category }
            onChange={ handleChange }
        >
            <option value="">-- Seleccione --</option>
            { categories.map( category => (
                <option
                    key={ category.id }
                    value={ category.id }
                >
                    { category.name }
                </option>
            )) }

        </Select>
    </div>

    <label
            htmlFor="amount"
            className="text-xl"
        >Fecha Gasto: </label>

        <DatePicker 
            className="bg-slate-100 border-0 p-2 w-full"
            value={ expense.date }
            onChange={ handleChangeDate }
        />
    <input
        type="submit"
        className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase 
        font-bold rounded-lg"
        value= { state.editingId ? 'Guardar cambios' : 'Registrar Gasto' }
    />

    </form>
  )
}
