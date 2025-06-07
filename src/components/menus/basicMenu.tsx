import { NavLink } from "react-router";
import useCustomLogin from "../../hooks/useCustomLogin";
import logo from '../../assets/logo.png';

function BasicMenu() {

  const {loginState, loginStatus} = useCustomLogin()

  const {doLogout} = useCustomLogin()

  return (
    <nav id='navbar' className="fixed top-0 z-10 w-full bg-main flex p-6 ">
      <div className="flex justify-between w-full" >

        <ul className="flex text-white font-bold">
          <li className="flex items-center pr-6 text-2xl mr-10" style={{ maxWidth: '320px' }}>
            <NavLink to='/'><img src={logo}/></NavLink>
          </li>
          <li className="flex items-center pr-6 text-2xl">
            <NavLink to='/about'>About</NavLink>
          </li>

          {/* 로그인해서 email이 있는 경우만 사용*/}
          {loginStatus && <> 
          <li className="flex items-center pr-6 text-2xl">
            <NavLink to='/todo/'>Todo</NavLink>
          </li>
          <li className="flex items-center pr-6 text-2xl">
            <NavLink to='/products/'>Products</NavLink>
          </li>
          </>
          }
        </ul>

        <div className="font-medium">

        { ! loginStatus ?
          <div className="text-white text-sm m-1 rounded">
            <NavLink to={'/user/login'}>Login</NavLink>
          </div>
          :
          <div className=" flex gap-4 text-white text-sm m-1 rounded">

            <a className="text-white" href="/manager">관리자</a>

            { loginStatus == 'fulfilled' && <p>{loginState.nickname} 님</p>}
            {/* <NavLink to={'/user/logout'}>Logout</NavLink> */}
            <div onClick={()=>doLogout()}>Logout</div>
          </div>
        }
      </div>
      </div>

      
    </nav>
  )
}

export default BasicMenu
