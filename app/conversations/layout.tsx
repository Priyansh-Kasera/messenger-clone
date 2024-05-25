import getConversations from "../action/getConversation";
import getUsers from "../action/getUsers";
import SideBar from "../components/sidebar/SideBar";
import ConversationList from "./components/ConvesationList";

export default async function ConversationsLayout({
    children
}: { children: React.ReactNode }) {
    const conversations = await getConversations();
    const users = await getUsers();

    return (
        <SideBar>
            <div className="h-full">
                <ConversationList
                    users={users}
                    initialItem={conversations}
                />
                {children}
            </div>
        </SideBar>
    )
}