'use client'
import { SelectContent, Select, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/utils/axiosInstance";
import { apiUrls, pagePaths } from "@/utils/lib";
import { motion } from "framer-motion";
import { set } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const login = "login";
const register = "register";

export default function AuthPage() {
    const [currentMode, setCurrentMode] = useState(login);
    const [sideComponentX, setSideComponentX] = useState("100%");
    const [loginComponentX, setLoginComponentX] = useState(0);
    useEffect(() => {
        if (currentMode === login) {
            setSideComponentX("100%");
            setLoginComponentX("0%");
        } else {
            setSideComponentX("0%");
            setLoginComponentX("100%");
        }
    }, [currentMode])
    return (

        <div className="flex flex-row w-full h-full justify-center items-center bg-primary rounded-3xl shadow-xl">
            <div className="flex flex-row w-full h-full rounded-2xl bg-transparent relative">
                <motion.div className="w-1/2 h-full flex flex-col items-center justify-center absolute"
                    initial={{ x: loginComponentX }}
                    animate={{ x: loginComponentX }}
                    transition={{ duration: 0.75 }}
                >
                    {currentMode === login ? <LogInComponent currentMode={currentMode} setCurrentMode={setCurrentMode} /> : <RegisterComponent currentMode={currentMode} setCurrentMode={setCurrentMode} />}
                </motion.div>
                <motion.div className="w-1/2 h-full flex flex-col justify-center items-center absolute "
                    initial={{ x: sideComponentX }}
                    animate={{ x: sideComponentX }}
                    transition={{ duration: 0.75 }}
                >
                    <SideComponent currentMode={currentMode} />
                </motion.div>
            </div>
        </div>
    )
}

function LogInComponent({ currentMode, setCurrentMode }) {
    const router = useRouter();
    const [buttonLoading, setButtonLoading] = useState(false);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const handleSubmit = () => {
        const email = emailInputRef.current.value;
        const password = passwordInputRef.current.value;
        if (!email || email === "") {
            document.getElementById("login-email-error").classList.remove("hidden");
            return;
        }
        else {
            document.getElementById("login-email-error").classList.add("hidden");
        }
        if (!password || password === "") {
            document.getElementById("login-password-error").classList.remove("hidden");
            return;
        }
        else {
            document.getElementById("login-password-error").classList.add("hidden");
        }
        console.log(email, password);
        setButtonLoading(true);
        toast.loading("Logging in");
        axiosInstance.post(apiUrls.login, {
            username: email,
            password: password
        }).then((res) => {
            router.push(pagePaths.newChatPage);
        }).catch((err) => {
            console.log(err);
            toast.error("An error occured");
        }).finally(() => {
            setButtonLoading(false);
            toast.dismiss();
        })
    }
    return (
        <div className="flex flex-col w-96 rounded-2xl p-10 gap-7 justify-center items-center bg-secondary bg-opacity-40">
            <h2 className="text-3xl font-semibold">Log In </h2>
            <div className="flex flex-col gap-3 w-full h-full justify-center items-center">
                <form className="flex flex-col gap-3 w-full drop-shadow-sm" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}>
                    <input ref={emailInputRef} type="text" placeholder="Email" className="w-full px-3 py-1 rounded-2xl shadow-inner border border-gray-200 outline-gray-400" />
                    <span id="login-email-error" className="hidden text-red-500">Email is required</span>
                    <input ref={passwordInputRef} type="password" placeholder="Password" className="w-full px-3 py-1 rounded-2xl shadow-inner border border-gray-200 outline-gray-400" />
                    <span id="login-password-error" className="hidden text-red-500">Password is required</span>
                    <button type="submit" className="w-full px-3 py-1 rounded-2xl shadow-inner bg-[#719189] text-gray-200 font-semibold text-primary-foreground">Log In</button>
                </form>
                <div className="flex flex-row gap-2">
                    <p>Don't have an account?</p>
                    <button disabled={buttonLoading} className="text-[#719189] font-bold hover:underline" onClick={() => {
                        setCurrentMode(register);
                    }}>Register</button>
                </div>
            </div>
        </div>
    )
}


function SideComponent({ currentMode }) {

    const text = "SOUL SYNC"; // Your text

    const letterAnimation = {
        hidden: { y: 0 },
        visible: (i) => ({
            y: -10, // Jump upwards
            transition: {
                delay: i * 0.2, // Staggering effect
                duration: 0.5,
                repeat: Infinity, // Infinite jump
                repeatType: "reverse", // Makes the letters go up and then come back down
                repeatDelay: 2.5, // Delay between each letter's jump
            },
        }),
    };

    const reflectionAnimation = {
        hidden: { y: 0 },
        visible: (i) => ({
            y: 10, // Reflection moves downward

            transition: {
                delay: i * 0.2, // Sync with the text above
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 2.5,
            },
        }),
    };

    return (
        <motion.div
            className="flex flex-col flex-1 w-full h-full shadow-lg rounded-3xl justify-center items-center"
            animate={currentMode === login ? "login" : "register"}
            variants={{
                login: {
                    background: "#a9cfc5", // Replace with your gradient colors,
                    borderRadius: "200px 24px 24px 200px", // Rounded-right style
                },
                register: {
                    background: "#f6cdbf", // Replace with your gradient colors
                    borderRadius: "24px 200px 200px 24px", // Rounded-left style
                },
            }}
            initial={false} // Prevent animation on the first render
            transition={{
                duration: 0.8, // Smoothness of the transition
                ease: "easeInOut",
            }}
        >
            <div className="flex flex-col items-center w-fit h-fit text-4xl font-extrabold relative mb-6 scale-150">
                {/* Original text */}
                <div className="flex">
                    {text.split("").map((char, index) => (
                        <motion.span
                            key={index}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={letterAnimation}
                            className="text-gray-500"
                        >
                            {char}
                        </motion.span>
                    ))}
                </div>

                {/* Reflection text */}
                <div className="flex absolute top-full -mt-2">
                    {text.split("").map((char, index) => (
                        <motion.span
                            key={index}
                            custom={index}
                            initial={{ rotateX: 180 }}
                            animate="visible"
                            variants={reflectionAnimation}
                            className="text-gray-200 text-reflection"
                        >
                            <span className="rotate-90">
                                {char}
                            </span>
                        </motion.span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}


function RegisterComponent({ currentMode, setCurrentMode }) {
    const emailInputRef = useRef(null);
    const router = useRouter();
    const passwordInputRef = useRef(null);
    const confirmPasdwordInputRef = useRef(null);
    const nameInputRef = useRef(null);
    const genderInputRef = useRef(null);
    const dateOfBirthInputRef = useRef(null);
    const handleSubmit = () => {
        const name = nameInputRef.current.value;
        const email = emailInputRef.current.value;
        const password = passwordInputRef.current.value;
        const confirmPassword = confirmPasdwordInputRef.current.value;
        const dateOfBirth = dateOfBirthInputRef.current.value;
        if (!name || name === "") {
            document.getElementById("name-error").classList.remove("hidden");
            return;
        }
        else {
            document.getElementById("name-error").classList.add("hidden");
        }
        if (!email || email === "") {
            document.getElementById("email-error").classList.remove("hidden");
            return;
        }
        else {
            document.getElementById("email-error").classList.add("hidden");
        }
        if (!genderInputRef.current) {
            document.getElementById("select-error").classList.remove("hidden");
            return;
        }
        else {
            document.getElementById("select-error").classList.add("hidden");
        }
        if (!dateOfBirthInputRef.current.value) {
            document.getElementById("dob-error").classList.remove("hidden");
            return;
        }
        else {
            document.getElementById("dob-error").classList.add("hidden");
        }
        if (!password || password === "") {
            document.getElementById("password-error").classList.remove("hidden");
            return;
        }
        else {
            document.getElementById("password-error").classList.add("hidden");
        }
        if (password !== confirmPassword) {
            document.getElementById("confirm-password-error").classList.remove("hidden");
            return;
        }
        else {
            document.getElementById("confirm-password-error").classList.add("hidden");
        }
        console.log(email, password, name, genderInputRef.current);
        axiosInstance.post(apiUrls.register, {
            "username": email,
            "password": password,
            "fullName": name,
            "dob": dateOfBirth,
            "gender": genderInputRef.current
        }).then((response) => {
            toast.success("Verification email sent", {
                description: "Please verify your email to login"
            });
            router.push(pagePaths.verifyotpPage(email));
        }).catch((err) => {
            toast.error("An error occured");
        })
    }
    return (
        <div className="flex flex-col w-96 rounded-2xl p-10 gap-7 justify-center items-center bg-tertiary bg-opacity-40 ">
            <h2 className="text-3xl font-semibold">Register</h2>
            <div className="flex flex-col gap-3 w-full h-full justify-center items-center">
                <form className="flex flex-col gap-2 w-full drop-shadow-sm" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}>
                    <input ref={nameInputRef} type="text" placeholder="Name" className="w-full px-3 py-1 rounded-2xl border border-gray-200 outline-gray-400 shadow-inner" />
                    <span id="name-error" className="hidden text-red-500">Name is required</span>
                    <input ref={emailInputRef} type="email" placeholder="Email" className="w-full px-3 py-1 rounded-2xl border border-gray-200 outline-gray-400 shadow-inner" />
                    <span id="email-error" className="hidden text-red-500">Email is required</span>
                    <Select onValueChange={(e) => {
                        console.log(e);
                        genderInputRef.current = e;
                    }}>
                        <SelectTrigger className="w-full bg-white shadow-inner rounded-3xl text-base">
                            <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup >
                                <SelectLabel>Gender</SelectLabel>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <span id="select-error" className="hidden text-red-500 ">Select a gender</span>
                    <input ref={dateOfBirthInputRef} type="date" placeholder="Date of Birth" className="w-full px-3 py-1 rounded-2xl border border-gray-200 outline-gray-400 shadow-inner" />
                    <span id="dob-error" className="hidden text-red-500">Date of Birth is required</span>
                    <input ref={passwordInputRef} type="password" placeholder="Password" className="w-full px-3 py-1 rounded-2xl border border-gray-200 outline-gray-400 shadow-inner" />
                    <span id="password-error" className="hidden text-red-500">Password is required</span>
                    <input ref={confirmPasdwordInputRef} type="password" placeholder="Confirm Password" className="w-full px-3 py-1 rounded-2xl border border-gray-200 outline-gray-400 shadow-inner" />
                    <span id="confirm-password-error" className="hidden text-red-500">Passwords do not match</span>
                    <button type="submit" className="w-full px-3 py-1 rounded-2xl bg-[#c09392] text-gray-200 font-semibold text-primary-foreground mt-6">Register</button>
                </form>
                <div className="flex flex-row gap-2">
                    <p>Don't have an account?</p>
                    <button className="text-[#c09d92] font-bold hover:underline" onClick={() => {
                        setCurrentMode(login);
                    }}>Register</button>
                </div>
            </div>
        </div>
    )
}