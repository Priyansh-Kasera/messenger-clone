import getCurrentUser from "@/app/action/getCurrentUser";
import DesktopSideBar from "./DesktopSideBar";
import MobileFooter from "./MobileFooter";

const SideBar = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const currentUser = await getCurrentUser();

    return (
        <div className="h-full">
            <DesktopSideBar currentUser={currentUser!} />
            <MobileFooter />
            <main className="lg:pl-20 h-full">
                {children}
            </main>
        </div>
    )
}
export default SideBar;