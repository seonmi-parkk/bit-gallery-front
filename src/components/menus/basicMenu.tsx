import { NavLink } from "react-router";
import useCustomLogin from "../../hooks/useCustomLogin";

function BasicMenu() {

  const {loginState, loginStatus} = useCustomLogin()

  const {doLogout} = useCustomLogin()

  return (
    <nav id='navbar' className=" flex bg-blue-300">
      <div className="w-4/5 bg-gray-500" >

        <ul className="flex p-4 text-white font-bold">
          <li className="pr-6 text-2xl">
            <NavLink to='/'>Main</NavLink>
          </li>
          <li className="pr-6 text-2xl">
            <NavLink to='/about'>About</NavLink>
          </li>

          {/* 로그인해서 email이 있는 경우만 사용*/}
          {loginStatus && <> 
          <li className="pr-6 text-2xl">
            <NavLink to='/todo/'>Todo</NavLink>
          </li>
          <li className="pr-6 text-2xl">
            <NavLink to='/products/'>Products</NavLink>
          </li>
          </>
          }
        </ul>
      </div>

      <div className="w-1/5 flex justify-end bg-orange-300 p-4 font-medium">
        { ! loginStatus ?
          <div className="text-white text-sm m-1 rounded">
            <NavLink to={'/user/login'}>Login</NavLink>
          </div>
          :
          <div className="text-white text-sm m-1 rounded">
            { loginStatus == 'fulfilled' && <p>{loginState.nickname} 님</p>}
            {/* <NavLink to={'/user/logout'}>Logout</NavLink> */}
            <div onClick={()=>doLogout()}>Logout</div>
          </div>
        }
      </div>

    </nav>
  )
}

export default BasicMenu
