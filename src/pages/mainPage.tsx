import { NavLink } from "react-router";

function MainPage() {
  return ( 
    <div className="text-3xl">
      <div className="flex">
        <NavLink to='/about'>About</NavLink>           
      </div>

      <div>Main Page</div>
    </div>
  );
}

export default MainPage;