import { Box, styled } from "@carlos-hfc-ignite-ui/react"

export const ConnectBox = styled(Box, {
  marginTop: "$6",
  display: "flex",
  flexDirection: "column",
})

export const ConnectItem = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  border: "1px solid $gray600",
  padding: "$4 $6",
  borderRadius: "$md",
  marginBottom: "$2",
})

export const Form = styled(Box, {
  marginTop: "$6",
  display: "flex",
  flexDirection: "column",
  gap: "$4",

  label: {
    display: "flex",
    flexDirection: "column",
    gap: "$2",
  },
})
