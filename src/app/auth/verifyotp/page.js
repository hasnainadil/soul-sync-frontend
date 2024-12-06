'use client'
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { axiosInstance } from "@/utils/axiosInstance"
import { apiUrls, pagePaths } from "@/utils/lib"
import { toast } from "sonner"

export default function AuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOtpComponent />
        </Suspense>
    )
}

function VerifyOtpComponent() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const router = useRouter()

    const handleOtpChange = (otp) => {
        setOtp(otp);
    }

    useEffect(() => {
        if (searchParams.get("email")) {
            setEmail(searchParams.get("email"));
        }
    }, [searchParams])

    return (
        <div className="flex flex-col w-full h-full items-center justify-center bg-primary rounded-3xl">
            <div className="flex flex-col w-96 p-4 bg-secondary bg-opacity-50 rounded-2xl shadow-lg gap-3 items-center ">
                <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
                <div className="flex flex-col size-full">
                    <input id="email-input" className="w-full p-2 my-4 border border-gray-400 rounded-3xl shadow-inner" type="text" value={email} onChange={(e) => {
                        setEmail(e.target.value)
                    }} />
                    <span id="email-error" className="text-red-500 text-sm"></span>
                </div>
                <div className="flex flex-col size-full justify-center items-center">
                    <InputOTP maxLength={6} onChange={handleOtpChange}  >
                        <InputOTPGroup >
                            <InputOTPSlot index={0} className="bg-white shadow-inner mx-[2px] font-semibold" />
                            <InputOTPSlot index={1} className="bg-white shadow-inner mx-[2px] font-semibold" />
                            <InputOTPSlot index={2} className="bg-white shadow-inner mx-[2px] font-semibold" />
                            <InputOTPSlot index={3} className="bg-white shadow-inner mx-[2px] font-semibold" />
                            <InputOTPSlot index={4} className="bg-white shadow-inner mx-[2px] font-semibold" />
                            <InputOTPSlot index={5} className="bg-white shadow-inner mx-[2px] font-semibold" />
                        </InputOTPGroup>
                    </InputOTP>
                    <span id="otp-error" className="text-red-500 text-sm"></span>
                </div>
                <button className="bg-tertiary p-2 px-4 text-black font-semibold rounded-2xl shadow-xl active:scale-95" onClick={() => {
                    if (document.getElementById("email-input").value === "") {
                        document.getElementById("email-error").innerText = "Email is required"
                        return
                    }
                    else {
                        document.getElementById("email-error").innerText = ""
                    }
                    if (otp.length !== 6) {
                        document.getElementById("otp-error").innerText = "OTP must be 6 characters"
                        return
                    }
                    else {
                        document.getElementById("otp-error").innerText = ""
                    }
                    toast.loading("Verifying OTP")
                    axiosInstance.post(apiUrls.verifyotp, {
                        "username": email,
                        "otp": otp
                    }).then((res)=>{
                        router.push(pagePaths.authPage)
                    }).catch((err)=>{
                        console.error(err)
                    }).finally(()=>{
                        toast.dismiss()
                    })
                }}>
                    Verify OTP
                </button>
            </div>
        </div>
    )
}