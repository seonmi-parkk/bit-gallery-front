import { NavLink } from "react-router";
import useCustomLogin from "../../hooks/useCustomLogin";
import logo from '../../assets/logo.png';
import { MdOutlineLogout } from "react-icons/md";
import { GrUserAdmin } from "react-icons/gr";
import UseCustomCart from "../../hooks/useCustomCart";

function BasicMenu() {

  const {loginState, loginStatus, doLogout} = useCustomLogin()

  const {itemQuantity} = UseCustomCart()

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = apiUrl+"/upload/profile/";
  const defaultProfile = import.meta.env.VITE_DEFAULT_PROFILE;

  return (
    <nav id='navbar' className="fixed top-0 z-10 w-full bg-main flex px-10 py-6 ">
      <div className="flex justify-between  w-full" >

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
                <NavLink className="flex items-center "  to='/cart'>
                  Cart 
                  <span className="flex items-center justify-center bg-warn w-4 h-4 ml-1 text-[12px] rounded-full">{itemQuantity}</span>
                </NavLink>
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
              <div className="">
                <NavLink to={'/mypage'} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img className="w-fit" 
                      src={ loginState.profileImage != null ? 
                        imageUrl + loginState.profileImage : imageUrl + defaultProfile
                      }/>
                  </div>
                  <p>{loginState.nickname} 님</p>
                </NavLink>  
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
