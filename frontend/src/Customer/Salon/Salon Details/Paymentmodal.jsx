import React, { useState } from "react";
import { Modal, Button, Divider } from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

/**
 * PaymentModal
 *
 * Three ways to pay: scan a KHQR code, deep-link into a bank app,
 * or pay by card via Stripe.
 *
 * -------------------------------------------------------------
 * IMPORTANT — placeholder data:
 * `khqrString` and the deep links below are NOT real payment
 * data. A real KHQR string must come from your Bakong merchant
 * account (or your acquiring bank) and is normally generated
 * server-side per-transaction, because it encodes:
 *   - merchant ID / account
 *   - amount
 *   - currency
 *   - a transaction reference (so you can verify payment status)
 *
 * Stripe also needs a backend: you create a PaymentIntent
 * server-side and pass its `clientSecret` down as a prop —
 * the frontend can never hold your Stripe secret key.
 *
 * Once you have a backend endpoint, replace `khqrString`,
 * `deepLinks`, and `clientSecret` with real values, e.g.:
 *
 *   <PaymentModal
 *     open={paymentOpen}
 *     onClose={...}
 *     amount={totalPrice}
 *     khqrString={paymentData.khqrString}
 *     deepLinks={paymentData.deepLinks}
 *     clientSecret={paymentData.stripeClientSecret}
 *     stripePublishableKey={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}
 *     onConfirmed={...}
 *   />
 * -------------------------------------------------------------
 */

// Placeholder badges (bank initials) instead of real trademarked
// logos — swap `logo: null` for a real <img src="..."> asset once
// you have licensed logo files from each bank's brand/media kit.
const DEFAULT_DEEP_LINKS = [
  { name: "Bakong", scheme: "bakong://pay?qr=", initials: "BK", color: "#0B3D91" },
  { name: "ABA Mobile", scheme: "abamobile://pay?qr=", initials: "ABA", color: "#E4032E" },
  { name: "ACLEDA Mobile", scheme: "acledamobile://pay?qr=", initials: "ACL", color: "#00A651" },
  { name: "Wing", scheme: "wing://pay?qr=", initials: "W", color: "#F5A623" },
  { name: "Vattanac Bank", scheme: "vattanacbank://pay?qr=", initials: "VB", color: "#7A1F2B" },
];

// TODO: replace with your real Stripe publishable key (safe to
// expose client-side — it's the *secret* key that must never
// leave your backend). Best kept in an env var, e.g.
// import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const DEFAULT_STRIPE_PUBLISHABLE_KEY = "pk_test_MOCK_REPLACE_ME";

const BankLogoBadge = ({ initials, color }) => (
  <div
    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
    style={{ backgroundColor: color }}
  >
    {initials}
  </div>
);

/**
 * Inner card form — must be rendered inside <Elements>, which is
 * why it's split out from PaymentModal.
 */
const StripeCardForm = ({ clientSecret, onConfirmed }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setSubmitting(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    setSubmitting(false);

    if (stripeError) {
      setError(stripeError.message);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onConfirmed?.();
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1f2937",
        "::placeholder": { color: "#9ca3af" },
      },
      invalid: { color: "#dc2626" },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!clientSecret && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2">
          No `clientSecret` provided — this is a placeholder. Card
          payment won't actually process until your backend creates
          a Stripe PaymentIntent and passes its secret in.
        </p>
      )}

      <div className="border rounded-md p-3">
        <CardElement options={cardElementOptions} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={!stripe || submitting || !clientSecret}
      >
        {submitting ? "Processing..." : "Pay by Card"}
      </Button>
    </form>
  );
};

const PaymentModal = ({
  open,
  onClose,
  amount = 0,
  currency = "USD",
  khqrString = "MOCK-KHQR-STRING-REPLACE-WITH-REAL-MERCHANT-STRING",
  deepLinks = DEFAULT_DEEP_LINKS,
  clientSecret = null,
  stripePublishableKey = DEFAULT_STRIPE_PUBLISHABLE_KEY,
  onConfirmed,
}) => {
  const [tab, setTab] = useState("qr"); // "qr" | "app" | "card"
  const [status, setStatus] = useState("form"); // "form" | "success"

  // loadStripe caches the promise internally, but memoize per-key
  // so we don't re-create it on every render.
  const [stripePromise] = useState(() => loadStripe(stripePublishableKey));

  // Render the QR via a public QR image service so we don't need
  // to add a new npm dependency. Swap for a local QR lib
  // (e.g. `qrcode.react`) later if you'd rather not rely on
  // an external service in production.
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    khqrString
  )}`;

  const handleDeepLink = (scheme) => {
    const url = `${scheme}${encodeURIComponent(khqrString)}`;
    // Falls back silently on desktop / if the app isn't installed —
    // consider adding a "app not installed?" hint or app-store
    // fallback link once you're targeting real users.
    window.location.href = url;
  };

  // Called when the customer manually claims they've paid (QR/App
  // tabs — there's no programmatic confirmation for those here) or
  // when Stripe reports success (Card tab). This is a UI-only
  // confirmation right now: nothing has been verified server-side.
  // TODO: before treating this as a real paid booking, call your
  // backend to verify the transaction (Bakong transaction-check API
  // for KHQR, or trust Stripe's webhook for card) and only then
  // update booking status — don't rely solely on this client action.
  const handleMarkPaid = () => {
    setStatus("success");
  };

  const handleDone = () => {
    onConfirmed?.();
    setStatus("form"); // reset for next time this modal opens
    setTab("qr");
  };

  const handleClose = () => {
    onClose?.();
    setStatus("form");
    setTab("qr");
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        w-[320px] lg:w-[420px] bg-white shadow-lg rounded-xl p-6"
      >
        {status === "success" ? (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <CheckCircleIcon sx={{ fontSize: 64, color: "#16a34a" }} />

            <h2 className="text-lg font-semibold">Payment Successful</h2>

            <p className="text-sm text-gray-500">
              {currency} {Number(amount).toFixed(2)} received
            </p>

            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2 mt-1">
              This confirmation is UI-only — no real payment
              verification has happened yet. Wire up a backend check
              before treating this as a genuinely paid booking.
            </p>

            <Button
              fullWidth
              variant="contained"
              onClick={handleDone}
              sx={{ mt: 2 }}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-1">Complete Payment</h2>
            <p className="text-sm text-gray-500 mb-4">
              {currency} {Number(amount).toFixed(2)}
            </p>

            {/* Tab switcher: three choices */}
            <div className="flex gap-2 mb-5">
              <Button
                fullWidth
                size="small"
                variant={tab === "qr" ? "contained" : "outlined"}
                startIcon={<QrCode2Icon />}
                onClick={() => setTab("qr")}
              >
                Scan QR
              </Button>

              <Button
                fullWidth
                size="small"
                variant={tab === "app" ? "contained" : "outlined"}
                startIcon={<PhoneIphoneIcon />}
                onClick={() => setTab("app")}
              >
                Bank App
              </Button>

              <Button
                fullWidth
                size="small"
                variant={tab === "card" ? "contained" : "outlined"}
                startIcon={<CreditCardIcon />}
                onClick={() => setTab("card")}
              >
                Card
              </Button>
            </div>

            <Divider sx={{ mb: 3 }} />

            {tab === "qr" ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={qrImageUrl}
                  alt="KHQR payment code"
                  width={240}
                  height={240}
                  className="border rounded-lg"
                />
                <p className="text-xs text-gray-500 text-center">
                  Scan with any KHQR-supporting banking app
                  (Bakong, ABA, ACLEDA, Wing, and others).
                </p>
              </div>
            ) : tab === "app" ? (
              <div className="flex flex-col gap-2">
                {deepLinks.map((link) => (
                  <Button
                    key={link.name}
                    fullWidth
                    variant="outlined"
                    onClick={() => handleDeepLink(link.scheme)}
                    sx={{ justifyContent: "flex-start", gap: 1.5, textTransform: "none" }}
                  >
                    <BankLogoBadge initials={link.initials} color={link.color} />
                    Open in {link.name}
                  </Button>
                ))}
                <p className="text-xs text-gray-500 mt-1">
                  Opens your banking app directly. If nothing happens,
                  make sure the app is installed.
                </p>
              </div>
            ) : (
              <Elements stripe={stripePromise}>
                <StripeCardForm clientSecret={clientSecret} onConfirmed={handleMarkPaid} />
              </Elements>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Manual confirm — only relevant for the QR/App tabs,
                where there's no programmatic success callback like
                Stripe's. The Card tab confirms itself via Stripe
                above and jumps straight to the success screen. */}
            {tab !== "card" && (
              <Button fullWidth variant="contained" onClick={handleMarkPaid}>
                I've Completed Payment
              </Button>
            )}

            <Button fullWidth sx={{ mt: 1 }} onClick={handleClose}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;