import { NavLink } from "react-router";
import OnlyLoginComponent from "../components/common/onlyLoginComponent";

function aboutPage() {

    return ( 
        <OnlyLoginComponent>
            <div className="text-3xl">
            <div className="flex">
                <NavLink to='/'>Main</NavLink>      
                </div>
                <div>About Page</div>
            </div>
        </OnlyLoginComponent>
     );
}

export default aboutPage;