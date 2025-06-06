import { NavLink } from "react-router";
import useZustandCount from "../zstore/useZustandCount";

function MainPage() {

  const { current, inc, dec, changeAmount } = useZustandCount()

  return (
    <div className="text-3xl">
      <div className="flex">
        <NavLink to='/about'>About</NavLink>
      </div>

      <div>Main Page</div>
      <div>{current}</div>
      <button onClick={inc}>INC</button>
      <button onClick={dec}>DEC</button>

      <div onClick={() => changeAmount(5)}>5</div>
      <div onClick={() => changeAmount(10)}>10</div>
    </div>
  );
}

export default MainPage;