import { NavLink } from "react-router";

function aboutPage() {
    return ( 
        <div className="text-3xl">
              <div className="flex">
                <NavLink to='/about'>About</NavLink>           
              </div>
            <div>About Page</div>
        </div>
     );
}

export default aboutPage;