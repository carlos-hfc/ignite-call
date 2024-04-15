import "@/lib/dayjs"

import { QueryClientProvider } from "@tanstack/react-query"
import { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { DefaultSeo } from "next-seo"

import { queryClient } from "@/lib/react-query"
import { globalStyles } from "@/styles/global"

globalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <DefaultSeo
          description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
          canonical={process.env.NEXT_PUBLIC_URL}
          openGraph={{
            type: "website",
            locale: "pt_BR",
            url: process.env.NEXT_PUBLIC_URL,
            siteName: "Ignite Call",
            images: [
              {
                url: "/favicon.svg",
              },
            ],
          }}
        />

        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}
