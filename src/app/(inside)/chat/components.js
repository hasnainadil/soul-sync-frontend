'use client'

import { BotIcon, EllipsisIcon, Loader2, Trash2Icon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ScrollableContainer from "@/components/StyledScrollbar"
import { IoIosSend } from "react-icons/io";
import Avatar from "@/components/avatar";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "next/image";
import { axiosInstance } from "@/utils/axiosInstance";
import { useParams, usePathname, useRouter } from "next/navigation";
import { apiUrls, pagePaths } from "@/utils/lib";
import LoadingComponent from "@/components/loading";
import { toast } from "sonner";
import Link from "next/link";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ChatComponent({ isNewChat = true }) {
    const params = useParams()
    const avaterImageDummy = "https://sm.ign.com/t/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.300.jpg"
    const botImage = "https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1733457290~exp=1733460890~hmac=0904e32a975a1958c342c9d1b2c77979d6331610c77b8cb615de79546f89c5d3&w=740"
    const [messages, setMessages] = useState([])
    const messageInputRef = useRef(null)
    const getAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
    const [model, setModel] = useState(getAI.getGenerativeModel({ model: "gemini-1.5-flash" }))
    const [chat, setChat] = useState(null)
    const [responseLoading, setResponseLoading] = useState(false)
    const router = useRouter()
    const [creatingSessionLoading, setCreatingSessionLoading] = useState(false)
    const scrollAreaRef = useRef(null)
    const moodMessageQueue = useRef([])
    const MOOD_MESSAGE_THRESHOLD = 1
    const [moodValue, setMoodValue] = useState(5)

    const handleMessageSend = async (messageText, chat) => {
        if (messageText.trim() === "") return
        const newMessage = {
            message: messageText,
            isUser: true,
            sentAt: new Date().toLocaleTimeString()
        }
        messageInputRef.current.value = ""
        if (isNewChat) {
            setCreatingSessionLoading(true)
            chat.sendMessage(`give a title of the input text to save as a conversation name. Input Text: ${messageText}`).then((response) => {
                const title = response.response.candidates[0].content.parts.find(part => part.hasOwnProperty('text')).text
                axiosInstance.post(apiUrls.chat, {
                    name: title,
                }).then((response) => {
                    console.log(response)
                    const id = response.data.id // get the id of the chat
                    axiosInstance.post(apiUrls.addMessages, {
                        "message": messageText,
                        "sessionId": id,
                        "isUser": true
                    }).then((response) => {
                        console.log(response)
                        setCreatingSessionLoading(false)
                        router.push(pagePaths.chatPage(id))
                    }).catch((e) => {
                        console.error(e)
                        setCreatingSessionLoading(false)
                    })
                }).catch((e) => {
                    toast.error("Failed to create chat")
                    console.error(e)
                    setCreatingSessionLoading(false)
                })
            }).catch((e) => {
                toast.error("Failed to create chat")
                console.error(e)
                setCreatingSessionLoading(false)
            })
        }
        else {
            setMessages([...messages, newMessage])
            axiosInstance.post(apiUrls.addMessages, {
                message: messageText,
                sessionId: params.chatid,
                isUser: true,
            }).then((response) => {
                moodMessageQueue.current.push({
                    message: messageText,
                    isUser: true
                })
            })
            messageInputRef.current.value = ""
            setResponseLoading(true)
            if (!chat) {
                console.log("Chat not initialized")
                return
            }
            chat.sendMessage(messageText).then((response) => {
                console.log("Response: ", response)
                setMessages(prev => [...prev,
                {
                    isUser: false,
                    sentAt: new Date().toLocaleTimeString(),
                    message: response.response.candidates[0].content.parts.find(part => part.hasOwnProperty('text')).text,
                    // role: "model",
                    // parts: [
                    //     {
                    //         text: response.response.candidates[0].content.parts.find(part => part.hasOwnProperty('text')).text
                    //     }
                    // ]
                }])
                axiosInstance.post(apiUrls.addMessages, {
                    message: response.response.candidates[0].content.parts.find(part => part.hasOwnProperty('text')).text,
                    sessionId: params.chatid,
                    isUser: false,
                }).then((res) => {
                    moodMessageQueue.current.push({
                        message: response.response.candidates[0].content.parts.find(part => part.hasOwnProperty('text')).text,
                        isUser: false
                    })
                })
                setResponseLoading(false)
            }).catch((e) => {
                console.error(e)
                setResponseLoading(false)
            })
        }
    }

    useEffect(() => {
        const setUpChat = async () => {
            if (isNewChat) {
                setChat(model.startChat())
            }
            else {
                const history_added = [{
                    isUser: true,
                    sentAt: new Date().toLocaleTimeString(),
                    message: `You are interacting with an user of Soul Sync. Soul Sync is a personalized mental healt tracking website. Talk with your user. See if he or she is sad or happy and if the user ever seems to be in a bad mood, try to cheer him or her up. You can also ask the user about his or her day.`
                }]
                axiosInstance.get(apiUrls.chatById(params.chatid)).then((pastMessagesResponse) => {
                    console.log("Old messages of the chat: ", pastMessagesResponse.data)
                    setMessages(pastMessagesResponse.data)
                    if (scrollAreaRef.current) {
                        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
                    }
                    history_added.push(...pastMessagesResponse.data)
                    moodMessageQueue.current.push(pastMessagesResponse.data.map((message) => ({
                        message: message.message,
                        isUser: message.isUser
                    })))
                    console.log(history_added.map((message) =>
                        ({ role: message.isUser ? "user" : "model", parts: [{ text: message.message }] })
                    ))
                    const tempChat = model.startChat({
                        history: history_added.map((message) =>
                            ({ role: message.isUser ? "user" : "model", parts: [{ text: message.message }] })
                        )
                    })
                    if (pastMessagesResponse.data.length == 1) {
                        const messageText = pastMessagesResponse.data[0].message
                        setResponseLoading(true)
                        handleMessageSend(messageText, tempChat)
                    }
                    setChat(tempChat)
                }).catch((e) => {
                    console.error(e)
                })
            }
        }
        setUpChat()
    }, [])

    useEffect(() => {
        // number of messages with isUser = true to be MOOD_MESSAGE_THRESHOLD
        console.log("Mood message queue: ", moodMessageQueue.current)
        const trackMood = async () => {
            const result = await model.generateContent([
                `
These are some messages between the user and the bot currently, given a json stringified array of messages: ${JSON.stringify(moodMessageQueue.current)}
You need to check the mood and give me a score of the mood of the user between 0 to 10. 0 being the saddest and 10 being the happiest. 
Your response:
{
    "mood": 5
}
5 here is just an example. strick to the format please.
`
            ])
            console.log("Mood tracking response: ", result)
            const mood = JSON.parse(result.response.candidates[0].content.parts.find(part => part.hasOwnProperty('text')).text)
            setMoodValue(mood.mood)
        }

        if (moodMessageQueue.current.filter(message => message.isUser).length >= MOOD_MESSAGE_THRESHOLD) {
            trackMood()
        }
    }, [moodMessageQueue.current])

    if (!chat) return <LoadingComponent />

    return (
        <div className="flex flex-col w-full h-full bg-white px-2 relative">
            {creatingSessionLoading &&
                <div className="absolute right-0 left-0 top-0 bottom-0 z-50 bg-gray-400 flex flex-col items-center justify-center bg-opacity-40">
                    <Loader2 className="animate-spin text-black" size={64} />
                </div>
            }
            <div className={cn("flex flex-row justify-center items-center w-full bg-white text-gray-700 text-xl font-semibold p-3 rounded-t-3xl relative", creatingSessionLoading ? "blur-md" : "")}>
                <div className="flex flex-row items-center gap-3">
                    <span className="">
                        Soul Sync Bot
                    </span>
                    <BotIcon size={24} />
                </div>
                <div
                    className={cn("absolute right-5 w-40 h-[10PX] rounded-3xl", `bg-gradient-to-r from-red-500 to-green-500 from-[${100 - moodValue * 10}%] to-[${moodValue * 10}%]`)}
                    // style={{
                    //     background: `linear-gradient(to right, red ${100 - moodValue * 10}%, green ${moodValue * 10}%)`,
                    //     transition: "background 0.3s ease-in-out", // Smooth transition
                    // }}
                ></div>

            </div>
            {isNewChat ? <div className="flex flex-col flex-1 justify-center items-center gap-3 bg-gray-50 rounded-3xl">
                <div className=" flex flex-col size-96 p-5 rounded-3xl justify-center items-center">
                    <BotIcon size={96} />
                    <span className="text-center text-gray-800 text-lg font-semibold">
                        Write a message to start a new chat
                    </span>
                </div>
            </div> :

                <ScrollableContainer ref={scrollAreaRef} className="flex flex-col flex-1 overflow-x-hidden gap-3 p-3 py-4 bg-slate-100 rounded-3xl">
                    {
                        messages.map((message, index) => (
                            <div className={`flex flex-row items-center ${message.isUser ? "justify-end" : "justify-start"}`} key={index}>
                                <div className={cn("flex gap-2 items-end", message.isUser ? "flex-row-reverse" : "flex-row")}>

                                    {message.isUser ? <Avatar avatarImgSrc={avaterImageDummy} size={32} /> :
                                        <button className="p-2 rounded-full bg-white">
                                            <BotIcon size={24} />
                                        </button>
                                    }
                                    <TooltipProvider delayDuration={500}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className={`flex flex-col p-2 px-5 rounded-2xl w-8/12 ${message.isUser ? "bg-white text-gray-800" : "bg-secondary text-white"}`}>
                                                    <span className="text-base">
                                                        {message.message}
                                                    </span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side={message.isUser ? "left" : "right"} className="bg-gray-600 text-gray-100">
                                                {message.sentAt}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        ))
                    }
                    {responseLoading && <div className="flex flex-row justify-start items-center gap-3 p-2 rounded-2xl">
                        <button className="p-2 rounded-full bg-white">
                            <BotIcon size={24} />
                        </button>
                        <div className="flex flex-row items-center">
                            <EllipsisIcon size={32} className=" animate-pulse delay-150" />
                            <EllipsisIcon size={32} className=" animate-pulse delay-300" />
                        </div>
                    </div>}
                </ScrollableContainer>
            }
            <div className="flex flex-row w-full h-16 bg-white p-3 rounded-b-3xl gap-3 items-center">
                <form onSubmit={(e) => {
                    e.preventDefault()
                    handleMessageSend(messageInputRef.current.value, chat)
                }} className="flex flex-row w-full h-16 bg-white p-3 rounded-b-3xl gap-3 items-center">
                    <input
                        ref={messageInputRef}
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 p-3 rounded-2xl focus:outline-none shadow-inner"
                    />
                    <button className="bg-secondary text-white p-[6px] rounded-full " type="submit">
                        <IoIosSend size={26} />
                    </button>
                </form>
            </div>
        </div>
    )

}

export function HitoryComponent() {
    const dummyData = [
        {
            id: 1,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 2,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 3,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 4,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 5,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 2,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 3,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 4,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 5,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 2,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 3,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 4,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 5,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 2,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 3,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 4,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 5,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 2,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 3,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 4,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
            id: 5,
            history: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        },
    ]

    const [pastChats, setPastChats] = useState([])
    const pathname = usePathname()

    useEffect(() => {
        axiosInstance.get(apiUrls.chat).then((response) => {
            setPastChats(response.data)
            console.log("Past Chats: ", response.data)
        }).catch((e) => {
            console.error(e)
        })
    }, [pathname])


    return (
        <div className="flex flex-col w-full h-full ">
            <h2 className="text-2xl text-gray-800 font-bold px-5">History</h2>
            <ScrollableContainer className="flex flex-col flex-1 overflow-x-hidden gap-3 p-5">
                {pastChats.length > 0 && pastChats.map((data, index) => (
                    <div
                        className="group flex flex-row w-full h-fit gap-3 items-center cursor-pointer p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 shadow-md"
                        key={index}
                    >
                        <Link href={pagePaths.chatPage(data.id)} className="text-sm text-gray-800 line-clamp-1 flex-1">
                            {data.name}
                        </Link >
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="size-fit opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Trash2Icon
                                        size={22}
                                        className="cursor-pointer text-red-500"
                                    />
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Are you sure you want to delete this chat ?
                                    </DialogTitle>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <button className="size-fit bg-red-500 text-white p-2 rounded-3xl px-5 shadow-lg" onClick={() => {
                                            toast.loading("Deleting chat")
                                            axiosInstance.delete(apiUrls.chatById(data.id)).then((response) => {
                                                console.log(response)
                                                toast.success("Chat deleted")
                                                setPastChats(prev => prev.filter(chat => chat.id !== data.id))
                                            }).catch((e) => {
                                                console.error(e)
                                            }).finally(() => {
                                                toast.dismiss()
                                            })
                                        }}>
                                            Delete
                                        </button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                ))}
            </ScrollableContainer>
        </div>
    )
}
