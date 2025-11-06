"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function AuthDebugger() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [tokens, setTokens] = useState<any>({});

  useEffect(() => {
    const updateTokens = () => {
      if (typeof window !== "undefined") {
        setTokens({
          accessToken: localStorage.getItem("accessToken"),
          refreshToken: localStorage.getItem("refreshToken"),
          user: localStorage.getItem("user"),
        });
      }
    };

    updateTokens();

    const interval = setInterval(updateTokens, 1000);

    return () => clearInterval(interval);
  }, [user, isAuthenticated]);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg shadow-lg max-w-md text-xs font-mono z-50">
      <div className="font-bold text-sm mb-2 text-yellow-400">Auth Debug</div>

      <div className="space-y-1">
        <div>
          <span className="text-gray-400">Authenticated:</span>{" "}
          <span className={isAuthenticated ? "text-green-400" : "text-red-400"}>
            {isAuthenticated ? "Yes" : "No"}
          </span>
        </div>

        <div>
          <span className="text-gray-400">Role:</span>{" "}
          <span className="text-blue-400">{user?.role || "None"}</span>
          {isAdmin && <span className="ml-2 text-purple-400">(Admin)</span>}
        </div>

        <div>
          <span className="text-gray-400">Username:</span>{" "}
          <span className="text-cyan-400">
            {user?.username || "Not logged in"}
          </span>
        </div>

        <div>
          <span className="text-gray-400">Access Token:</span>{" "}
          <span
            className={tokens.accessToken ? "text-green-400" : "text-red-400"}
          >
            {tokens.accessToken
              ? `${tokens.accessToken.substring(0, 20)}...`
              : "Missing"}
          </span>
        </div>

        <div>
          <span className="text-gray-400">Refresh Token:</span>{" "}
          <span
            className={tokens.refreshToken ? "text-green-400" : "text-red-400"}
          >
            {tokens.refreshToken
              ? `${tokens.refreshToken.substring(0, 20)}...`
              : "Missing"}
          </span>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-yellow-300 text-xs">
            Not authenticated. Go to{" "}
            <a href="/login" className="underline text-blue-300">
              /login
            </a>
          </div>
        </div>
      )}

      {isAuthenticated && !tokens.accessToken && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-red-300 text-xs">
            Authenticated but tokens missing! This is a bug. Try logging out and
            back in.
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-700">
        <button
          onClick={() => {
            console.log("=== LocalStorage Debug ===");
            console.log("accessToken:", localStorage.getItem("accessToken"));
            console.log("refreshToken:", localStorage.getItem("refreshToken"));
            console.log("user:", localStorage.getItem("user"));
            console.log("All localStorage keys:", Object.keys(localStorage));
            alert("Check browser console (F12) for localStorage details");
          }}
          className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
        >
          Debug Console
        </button>
      </div>
    </div>
  );
}
