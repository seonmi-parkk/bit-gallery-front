import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SignupFormData = {
  email: string;
  emailVerified: boolean;
  nickname: string;
  nicknameVaildated: boolean;
  password: string;
  passwordValidated: boolean;
};

const initSignupForm = (): SignupFormData => ({
  email: '',
  emailVerified: false,
  nickname: '',
  nicknameVaildated: false,
  password: '',
  passwordValidated: false

});

type SignupState = {
  step: number;
  form: SignupFormData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateForm: (data: Partial<SignupFormData>) => void;
  reset: () => void;
};

export const useSignupStore = create<SignupState>()(
  persist( // localStorage에 저장하여 새로고침해도 데이터 유지
    (set) => ({
      step: 0,
      form: initSignupForm(),
      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: state.step + 1 })),
      prevStep: () => set((state) => ({ step: state.step - 1 })),
      updateForm: (data) =>
        set((state) => ({ form: { ...state.form, ...data } })),
      reset: () =>
        set({
          step: 0,
          form: initSignupForm(),
        }),
    }),
    {
      name: 'signup-store', // localStorage에 저장될 key
    }
  )
);
