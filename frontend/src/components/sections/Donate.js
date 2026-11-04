import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Reveal } from "../motion";
import { toast } from "sonner";
import { Heart } from "lucide-react";

const PRESETS = [1001, 2501, 5001, 11001];

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const Donate = () => {
  const [amount, setAmount] = useState(2501);
  const [custom, setCustom] = useState("");
  const [donor, setDonor] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    api.get("/donate/config").then(({ data }) => setEnabled(data.enabled)).catch(() => setEnabled(true));
  }, []);

  const finalAmount = custom ? parseInt(custom, 10) : amount;

  const handleDonate = async () => {
    if (!finalAmount || finalAmount < 1) return toast.error("Please enter a valid amount");
    setLoading(true);
    try {
      const { data: order } = await api.post("/donate/order", { amount: finalAmount, ...donor });
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Could not load payment gateway");
      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Sri Bhavatarini Ashrama",
        description: "Donation",
        order_id: order.order_id,
        prefill: { name: donor.name, email: donor.email, contact: donor.phone },
        theme: { color: "#D95A21" },
        handler: async (res) => {
          try {
            await api.post("/donate/verify", res);
            toast.success("Thank you for your generous offering 🙏");
          } catch {
            toast.error("Payment could not be verified. Please contact us.");
          }
        },
      });
      rzp.open();
    } catch (e) {
      const detail = e.response?.data?.detail;
      toast.error(detail || "Online donations are being set up. Please contact the ashrama.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="donate" data-testid="donate" className="py-28 md:py-40" style={{ background: "var(--bg-maroon)" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="label-eyebrow mb-6">Donate Now</div>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.95]" style={{ color: "var(--text-inverse)" }}>
            Your offering keeps the <span className="italic" style={{ color: "var(--accent-saffron)" }}>lamp burning.</span>
          </h2>
          <p className="mt-8 font-sans text-lg leading-relaxed max-w-md" style={{ color: "#E8DAD2" }}>
            Every contribution sustains our daily worship, free meals through Annadana,
            and service to the community. Give from the heart.
          </p>

          <div data-testid="bank-details" className="mt-10 max-w-md p-6 border"
            style={{ borderColor: "rgba(232,218,210,0.25)", background: "rgba(0,0,0,0.18)" }}>
            <div className="label-eyebrow mb-4" style={{ color: "var(--accent-saffron)" }}>Bank Transfer Details</div>
            <dl className="space-y-3 font-sans text-sm" style={{ color: "#E8DAD2" }}>
              <div className="flex justify-between gap-6"><dt className="opacity-70">Bank Name</dt><dd className="font-serif text-base" style={{ color: "var(--text-inverse)" }}>HDFC Bank</dd></div>
              <div className="flex justify-between gap-6"><dt className="opacity-70">A/c Name</dt><dd className="font-serif text-base text-right" style={{ color: "var(--text-inverse)" }}>Sri Bhavatarini Ashrama</dd></div>
              <div className="flex justify-between gap-6"><dt className="opacity-70">A/c Number</dt><dd data-testid="bank-account" className="font-mono tracking-wider" style={{ color: "var(--text-inverse)" }}>50100608663391</dd></div>
              <div className="flex justify-between gap-6"><dt className="opacity-70">IFSC</dt><dd data-testid="bank-ifsc" className="font-mono tracking-wider" style={{ color: "var(--text-inverse)" }}>HDFC0004895</dd></div>
            </dl>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="p-8 md:p-10" style={{ background: "var(--bg-primary)" }}>
            {!enabled && (
              <p data-testid="donate-notice" className="mb-6 font-sans text-sm p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                Online payments are being set up. You may still fill in your details — or reach us directly to contribute.
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {PRESETS.map((p) => (
                <button key={p} data-testid={`donate-preset-${p}`}
                  onClick={() => { setAmount(p); setCustom(""); }}
                  className="py-4 font-serif text-2xl border transition-colors duration-300"
                  style={{
                    borderColor: !custom && amount === p ? "var(--accent-saffron)" : "var(--border-light)",
                    background: !custom && amount === p ? "var(--accent-saffron)" : "transparent",
                    color: !custom && amount === p ? "var(--text-inverse)" : "var(--text-primary)",
                  }}>
                  ₹{p.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
            <input data-testid="donate-custom-amount" type="number" min="1" placeholder="Other amount (₹)"
              value={custom} onChange={(e) => setCustom(e.target.value)}
              className="mt-4 w-full px-4 py-3 font-sans outline-none border focus:border-[var(--accent-saffron)] transition-colors"
              style={{ borderColor: "var(--border-light)", background: "var(--bg-secondary)", color: "var(--text-primary)" }} />

            <div className="mt-4 space-y-3">
              <input data-testid="donate-name" placeholder="Your name" value={donor.name}
                onChange={(e) => setDonor({ ...donor, name: e.target.value })}
                className="w-full px-4 py-3 font-sans outline-none border focus:border-[var(--accent-saffron)] transition-colors"
                style={{ borderColor: "var(--border-light)", background: "var(--bg-secondary)" }} />
              <div className="grid grid-cols-2 gap-3">
                <input data-testid="donate-email" placeholder="Email" value={donor.email}
                  onChange={(e) => setDonor({ ...donor, email: e.target.value })}
                  className="w-full px-4 py-3 font-sans outline-none border focus:border-[var(--accent-saffron)] transition-colors"
                  style={{ borderColor: "var(--border-light)", background: "var(--bg-secondary)" }} />
                <input data-testid="donate-phone" placeholder="Phone" value={donor.phone}
                  onChange={(e) => setDonor({ ...donor, phone: e.target.value })}
                  className="w-full px-4 py-3 font-sans outline-none border focus:border-[var(--accent-saffron)] transition-colors"
                  style={{ borderColor: "var(--border-light)", background: "var(--bg-secondary)" }} />
              </div>
            </div>

            <button data-testid="donate-submit" onClick={handleDonate} disabled={loading}
              className="mt-6 w-full py-4 font-sans flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
              style={{ background: "var(--accent-saffron)", color: "var(--text-inverse)" }}>
              <Heart size={18} strokeWidth={1.5} />
              {loading ? "Processing…" : `Donate ₹${(finalAmount || 0).toLocaleString("en-IN")}`}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Donate;
