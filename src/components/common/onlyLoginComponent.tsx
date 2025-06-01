import type { ReactNode } from "react"
import useCustomLogin from "../../hooks/useCustomLogin"

const OnlyLoginComponent = ({ children }: { children: ReactNode }) => {

  const { loginStatus, moveToLoginReturn } = useCustomLogin()
  
  if (!loginStatus) {
    return moveToLoginReturn()
  }
  return (
    <>
      {children}
    </>
  )

}

export default OnlyLoginComponent