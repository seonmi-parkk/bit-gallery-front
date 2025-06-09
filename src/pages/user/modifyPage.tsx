import BasicMenu from "../../components/menus/basicMenu"
import ModifyComponent from "../../components/user/modifyComponent"

const ModifyPage = () => {
  return (
    <>
      <BasicMenu />
      <div className="my-5 w-full flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">

        <main className="md:w-4/5 lg:max-w-[700px] m-auto px-5 py-5">
          <div className="text-center text-4xl mb-8">회원정보 추가 입력</div>
          <div className="w-full mt-6 p-2">
            <ModifyComponent />
          </div>
        </main>
      </div>
    </>

  )
}

export default ModifyPage