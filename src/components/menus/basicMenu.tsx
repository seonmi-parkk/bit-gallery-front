import { NavLink } from "react-router";
import useCustomLogin from "../../hooks/useCustomLogin";
import logo from '../../assets/logo.png';
import { STATIC_IMG_URL } from "../../api/apiUrl";
import { MdOutlineLogout } from "react-icons/md";
import { GrUserAdmin } from "react-icons/gr";

function BasicMenu() {

  const {loginState, loginStatus} = useCustomLogin()

  const {doLogout} = useCustomLogin()

  return (
    <nav id='navbar' className="fixed top-0 z-10 w-full bg-main flex px-10 py-6 ">
      <div className="flex justify-between w-full" >

        <ul className="flex text-white font-medium">
          <li className="flex items-center pr-6 text-2xl mr-10" style={{ maxWidth: '320px' }}>
            <NavLink to='/'><img src={logo}/></NavLink>
          </li>
          <li className="flex items-center pr-6 text-lg">
            <NavLink to='/products/'>상품 리스트</NavLink>
          </li>

          {/* 로그인해서 email이 있는 경우만 사용*/}
          {loginStatus && 
            <> 
              <li className="flex items-center pr-6 text-lg">
                <NavLink to='/products/add'>상품 등록</NavLink>
              </li>
              <li className="flex items-center pr-6 text-lg">
                <NavLink to='/cart'>Cart</NavLink>
              </li>
            </>
          }
        </ul>

        <div className="font-medium">

          { loginStatus !== 'fulfilled' ?
            <div className="text-white text-sm m-1 rounded">
              <NavLink to={'/user/login'}>Login</NavLink>
            </div>
            :
            <div className="flex items-center gap-4.5 text-white  m-1 rounded">
              {loginState.roleNames.includes('MANAGER') &&
                <a className="flex items-center text-white" href="/manager">
                  <GrUserAdmin className="text-lg mr-1"/>관리자
                </a>
              }
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img className="w-fit" src={STATIC_IMG_URL+"/"+loginState.profileImage}/>
                </div>
                <p>{loginState.nickname} 님</p>
              </div>
              <div onClick={()=>doLogout()} className="text-2xl cursor-pointer"><MdOutlineLogout/></div>
            </div>
          }
        </div>
      </div>

      
    </nav>
  )
}

export default BasicMenu
