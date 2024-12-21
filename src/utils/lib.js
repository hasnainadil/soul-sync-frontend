import { Edit, Gift, LayoutDashboardIcon, MessageCircle, NotebookPen, PencilIcon, SettingsIcon } from "lucide-react";

export const localStorageSessionData = "sessionData";

export const pagePaths = {
    authPage: "/auth",
    newChatPage: "/chat",
    chatPage: (id) => `/chat/${id}`,
    verifyotpPage: (email) => `/auth/verifyotp?email=${email}`,
    navigatePages: [
        {
            name: "Chat",
            icon: <MessageCircle />,
            path: "/chat"
        },
        {
            name: "Journal",
            icon: <NotebookPen />,
            path: "/journal"
        },
        {
            name: "Dashboard",
            icon: <LayoutDashboardIcon />,
            path: "/dashboard"
        },
        {
            name: "Gifts",
            icon: <Gift />,
            path: "/gifts"
        },
        {
            name: "Edit Profile",
            icon: <PencilIcon />,
            path: "/edit-profile"
        },

    ]
}

const apiBaseUrl = "http://localhost:8080/v1";

export const apiUrls = {
    chat: apiBaseUrl + "/chat",
    chatById: (id) => apiBaseUrl + `/chat/${id}`,
    addMessages: apiBaseUrl + "/chat/messages",
    login: apiBaseUrl + "/auth",
    register: apiBaseUrl + "/auth/register",
    verifyotp: apiBaseUrl + "/auth/verify",
    userData : apiBaseUrl + "/user",
    getactivities : apiBaseUrl + "/activity",
}


