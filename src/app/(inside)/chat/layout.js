'use client'

import { HitoryComponent } from "./components"

export default function Layout({children}) {
    

    return (
        <div className="flex flex-row w-full h-full bg-primary overflow-hidden transition-all ease-in-out delay-300">
            <div className="flex flex-col w-1/5 h-full py-10">
                <HitoryComponent />
            </div>
            <div className="flex flex-col flex-1 h-full bg-primary rounded-l-3xl">
                {children}
            </div>
        </div>
    )
}