import { Outlet } from "react-router";
import BasicMenu from "../components/menus/basicMenu";
import CartComponent from "../components/menus/cartComponent";

function BasicLayout() {

  return (
    <div className="bg-main">
      <BasicMenu/>
      <div className="w-full mt-20 px-6 py-8">
        <main className=" w-full px-5 py-5">
          <Outlet />
        </main>
        {/* <aside className="bg-green-300 md:w-1/3 lg:w-1/4 px-5 py-40">
          <CartComponent/>
        </aside> */}
      </div>
    </div>
  );
}

export default BasicLayout;