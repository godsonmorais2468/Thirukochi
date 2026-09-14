export const MOCK_OTP = "123456";
export const OTP_LENGTH = 6;
export const MPIN_LENGTH = 4;
export const OTP_COUNTDOWN = 30;

export const portfolio = {
  value: 125000,
  grams: 8.85,
  changePercent: 2.4,
  since: "Since you joined",
  holdings: [
    { label: "Gold savings plan", grams: 5.42, value: 76_500 },
    { label: "Digital gold", grams: 2.18, value: 30_800 },
    { label: "Diamond credits", grams: 1.25, value: 17_700 },
  ],
};

export const goldRate = {
  updatedAt: "Today, 10:42 AM",
  trend: -30,
  trendPercent: -0.21,
  types: [
    { karat: "22K", per: "1 gram", price: 14125.0, featured: true },
    { karat: "18K", per: "1 gram", price: 11552.0, featured: false },
    { karat: "24K", per: "1 gram", price: 15310.0, featured: false },
  ],
};

export const savings = {
  goalLabel: "Wedding collection",
  target: 200000,
  saved: 125000,
  monthly: 10000,
  maturity: "Mar 2027",
};

export const schemes = [
  {
    name: "Kanakadhara",
    tenure: "11 + 1 months",
    note: "One month's instalment gifted at maturity",
    minimum: 2500,
  },
  {
    name: "Swarna Nidhi",
    tenure: "18 months",
    note: "Rate protection on the day you book",
    minimum: 5000,
  },
  {
    name: "Diamond Circle",
    tenure: "24 months",
    note: "Priority access to solitaire collections",
    minimum: 10000,
  },
];

export const notifications = [
  { title: "Instalment received", body: "₹10,000 credited to Kanakadhara", time: "2h ago" },
  { title: "Rate alert", body: "22K gold eased by ₹30 per gram", time: "Today" },
  { title: "Invitation", body: "Private viewing at Marine Drive boutique", time: "Yesterday" },
];

export const menuLinks = [
  "My schemes",
  "Rate alerts",
  "Boutique appointments",
  "Certificates & invoices",
  "Support",
];
