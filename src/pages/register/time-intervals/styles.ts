import { Box, styled, Text } from "@carlos-hfc-ignite-ui/react"

export const IntervalBox = styled(Box, {
  marginTop: "$6",
  display: "flex",
  flexDirection: "column",
})

export const IntervalsContainer = styled("div", {
  border: "1px solid $gray600",
  borderRadius: "$md",
  marginBottom: "$4",
})

export const IntervalItem = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "$3 $4",

  "& + &": {
    borderTop: "1px solid $gray600",
  },
})

export const IntervalDay = styled("label", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
  userSelect: "none",
})

export const IntervalInputs = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$2",

  "input::-webkit-calendar-picker-indicator": {
    filter: "invert(100%) brightness(30%)",
  },

  "input:disabled": {
    opacity: 0.5,
  },
})

export const FormError = styled(Text, {
  color: "#f75a68",
  marginBottom: "$4",
})
