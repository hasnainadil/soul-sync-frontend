'use client'

import ScrollableContainer from "@/components/StyledScrollbar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { pagePaths } from "@/utils/lib"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Layout({ children }) {
    return (
        <div className="flex size-full overflow-hidden text-black break-normal bg-tertiary bg-opacity-50 rounded-3xl transition-all ease-in-out duration-500">
            {/* Sidebar */}
            <SideBar />
            {/* Main Content */}
            <ScrollableContainer className="flex flex-col flex-1 overflow-y-auto ml-[2px] rounded-3xl overflow-hidden bg-white drop-shadow-lg">
                {children}
            </ScrollableContainer>
        </div>
    )
}

function SideBar() {
    const pathname = usePathname()

    return (
        <div className={cn(" w-fit h-full items-center flex flex-col px-3 relative")}>
            <div className="flex flex-col gap-10 flex-1 justify-center drop-shadow-xl transition-all delay-300 ease-linear">
                {pagePaths.navigatePages.map((page, index) => (
                    <TooltipProvider key={index} delayDuration={500} >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={page.path} className={cn(pathname === page.path ? "bg-gray-500 text-tertiary p-3 rounded-3xl" : "p-3 hover:translate-x-2 transition-all duration-300 ease-in-out hover:bg-primary rounded-3xl", "")}>
                                    {page.icon}
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" >
                                <span className="text-black text-sm">{page.name}</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
            <TooltipProvider delayDuration={500} >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className="absolute bottom-5 size-fit">
                            <LogOut size={24} strokeWidth={2.75} className="text-black -scale-x-100" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" >
                        <span className="text-black text-sm">Log Out</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

        </div>
    )
}