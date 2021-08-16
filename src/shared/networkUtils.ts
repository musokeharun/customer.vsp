const networks = [
  {
    label: "MTN_UGANDA",
    values: ["25677", "25678", "25676"],
  },
  {
    label: "AIRTEL_UGANDA",
    values: ["25670", "25675"],
  },
  {
    label: "AFIRCELL_UGANDA",
    values: ["25679"],
  },
];

export const getNetworkType = (contact: string | undefined) => {
  // IF EMPTY
  if (!contact) return "N/A";
  const type = networks.find((item) =>
    item.values.some((arrayItem) => contact.startsWith(arrayItem))
  );

  return type ? type.label : "N/A";
};
