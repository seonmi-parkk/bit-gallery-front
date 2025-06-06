import { create } from "zustand"

export interface CounterStore {
  current: number,
  amount: number,
  inc: () => void,
  dec: () => void,
  changeAmount: (num:number) => void
}

const useZustandCount = create<CounterStore>( (set, get) => {
  return {
    current: 13,
    amount: 1,
    inc: () => { set({ current: get().current + get().amount }) },
    dec: () => { set({ current: get().current - get().amount }) },
    changeAmount: (num: number) => {
      set( {amount: num} )
    }
  }
} )

export default useZustandCount