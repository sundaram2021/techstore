
"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, X, Zap, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SearchModal } from "@/components/search/search-modal";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCart } from "@/hooks/use-cart";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { data: session } = authClient.useSession();
    const { cart } = useCart();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Keyboard shortcut to open search (CMD/CTRL + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            if (e.key === "Escape") {
                setIsSearchOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        let active = true;
        if (!session) {
            setIsAdmin(false);
            return () => {
                active = false;
            };
        }

        fetch("/api/auth/permissions", { cache: "no-store" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!active) return;
                setIsAdmin(!!data?.isAdmin);
            })
            .catch(() => {
                if (!active) return;
                setIsAdmin(false);
            });

        return () => {
            active = false;
        };
    }, [session?.user?.email]);

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    isScrolled
                        ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
                        : "bg-transparent"
                )}
            >
                <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-3" data-highlight="logo">
                        <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#0ea5e9] flex items-center justify-center overflow-hidden">
                            <Zap className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">
                            TechStore
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-10">
                        <Link
                            href="/"
                            className="underline-animation text-sm font-medium text-gray-600 transition-colors hover:text-[#0ea5e9]"
                            data-highlight="nav-home"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className="underline-animation text-sm font-medium text-gray-600 transition-colors hover:text-[#0ea5e9]"
                            data-highlight="nav-products"
                        >
                            Products
                        </Link>
                        <Link
                            href="#"
                            className="underline-animation text-sm font-medium text-gray-600 transition-colors hover:text-[#0ea5e9]"
                            data-highlight="nav-categories"
                        >
                            Categories
                        </Link>
                        <Link
                            href="#"
                            className="underline-animation text-sm font-medium text-gray-600 transition-colors hover:text-[#0ea5e9]"
                            data-highlight="nav-deals"
                        >
                            Deals
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden sm:flex rounded-full hover:bg-[#f0f9ff] hover:text-[#0ea5e9]"
                            onClick={() => setIsSearchOpen(true)}
                            data-highlight="search-button"
                        >
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative rounded-full hover:bg-[#f0f9ff] hover:text-[#0ea5e9]"
                            onClick={() => {
                                if (!session) {
                                    router.push("/sign-in");
                                } else {
                                    router.push("/cart");
                                }
                            }}
                            data-highlight="cart-button"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {session && (cart?.items.length || 0) > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#0ea5e9] text-[10px] font-bold text-white flex items-center justify-center">
                                    {cart?.items.length}
                                </span>
                            )}
                            <span className="sr-only">Cart</span>
                        </Button>

                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-highlight="user-menu">
                                        <Avatar className="h-10 w-10 border border-gray-200">
                                            <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                                            <AvatarFallback className="bg-[#0ea5e9]/10 text-[#0ea5e9]">
                                                {session.user.name?.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {isAdmin && (
                                        <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={async () => {
                                            await authClient.signOut();
                                            router.refresh();
                                        }}
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/sign-in">
                                <Button data-highlight="sign-in-button">Sign In</Button>
                            </Link>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden rounded-full"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay & Panel ... (keeping existing mobile menu logic but could update) */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
                    isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div
                className={cn(
                    "fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl transition-transform duration-500 ease-out md:hidden",
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <span className="text-lg font-semibold">Menu</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <nav className="p-6 space-y-6">
                    <Link
                        href="/"
                        className="block text-lg font-medium text-gray-900 hover:text-[#0ea5e9] transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/products"
                        className="block text-lg font-medium text-gray-900 hover:text-[#0ea5e9] transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Products
                    </Link>
                    {/* ... other links */}
                </nav>
            </div>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <div className="h-20" />
        </>
    );
}
