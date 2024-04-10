import { Heading, Text } from "@carlos-hfc-ignite-ui/react"
import Image from "next/image"

import appPreviewImg from "@/assets/app-preview.png"

import { ClaimUsernameForm } from "./components/ClaimUsernameForm"
import { Container, Hero, Preview } from "./styles"

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading size="4xl">Agendamento descomplicado</Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUsernameForm />
      </Hero>

      <Preview>
        <Image
          src={appPreviewImg}
          alt="Calendário simbolizando aplicação"
          height={400}
          quality={100}
          priority
        />
      </Preview>
    </Container>
  )
}
