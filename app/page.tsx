/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import TelegramAuth from "@/components/TelegramAuth";
import { getSession } from "@/utils/session";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export default async function Home() {
  const[userData, setUserData] = useState<UserData | null>(null)
  const session = await getSession()

  useEffect(()=> {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData)
    }
  }, [])

  return (
    <main className="p-4">
      {
        userData ?
          (
            <>
              <h1 className="text-2xl font-bold mb-4">User Data</h1>
              <ul>
                <li>ID: {userData.id}</li>
                <li>First Name: {userData.first_name}</li>
                <li>Last Name: {userData.last_name}</li>
                <li>Username: {userData.username}</li>
                <li>Language Code: {userData.language_code}</li>
                <li>Is Premium: {userData.is_premium ? 'Yes' : 'No'}</li>
              </ul>
              <pre>{JSON.stringify(session, null, 2)}</pre>
              <TelegramAuth />
            </>
          ):
          (
            <div>Loading...</div>
          )
      }
    </main>
  );
}