'use client';

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";

export default function Page() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
                email,
                password,
            });
            localStorage.setItem("token", response.data.token);
            router.push("/");
        } catch (err) {
            console.error(err);
            setError("Login failed. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-md">
                <CardHeader>
                    <CardTitle className="text-center text-xl">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button className="w-full" onClick={handleLogin}>Sign In</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
