import { Outlet } from "react-router-dom";
import Header from "@/components/Header/Header";
import MainFooter from "@/components/Footer/MainFooter";

const WebsiteLayout = () => {
  return (
    <>
      <div className="bg-white dark:bg-gray-900">
        <Header />
        <main className="flex-1 pt-0">
          <Outlet />
        </main>
        <MainFooter />
      </div>
    </>
  );
};

export default WebsiteLayout;