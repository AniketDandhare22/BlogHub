import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import Navbar from "./Navbar";
import { useTheme } from "./context/useTheme";
import { useState,useEffect } from "react";
import {useAuth} from "./context/AuthProvider"
import { loadRazorpay } from "./utils/loadRazorpay";
import api from "./api/api"
import { toast } from "react-toastify";


const startPayment = async (planType ,isAuth) => {
  if (!isAuth) {
    toast.info("Please login to continue");
    return;
  }

  const res = await loadRazorpay();
  if (!res) {
    toast.error("Razorpay SDK failed to load");
    return;
  }

  try {
    // 1️⃣ Create order
    const orderRes = await api.post("/payment/create-order", { planType });
    const orderData = orderRes.data;


    if (!orderData.success) {
      toast.error("Order creation failed");
      return;
    }

    // 2️⃣ Open Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ENV ONLY
      amount: orderData.order.amount,
      currency: "INR",
      name: "BlogHub",
      description: `Upgraded to ${planType}`,
      order_id: orderData.order.id,

      handler: async function (response) {
        // 3️⃣ Verify payment
        const verifyRes = await api.post("/payment/verify-payment", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          planType,
        });

        const verifyData = verifyRes.data;


        if (verifyData.success) {
          toast.success("Payment successful 🎉");
          window.location.reload();
        } else {
          toast.error("Payment verification failed");
        }
      },

      theme: {
        color: planType === "Pro" ? "#FF6900" : "#0765F5",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};



function Pricing() {
    const {isAuth,user} = useAuth();
    const {dark} =useTheme();
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        // Update the angle continuously
        const interval = setInterval(() => {
        setAngle(prev =>(prev + 3) % 360); // increase 2 degrees per tick
        }, 50); // 50ms → smooth movement
        return () => clearInterval(interval);
    }, []);
  return (
    <div className={`${dark?"":"light"} lg:h-screen md:h-screen h-fit bg-primaryD light:bg-secondary text-white light:text-primaryD light:text-primaryD `}>
        <Navbar/>
      <div className="max-w-[1300px] h-[85%] px-10 pt-5 mt-10 rounded-2xl mx-auto text-center light:bg-primary bg-secondaryD">

        {/* Header */}
        <h1 className="text-4xl font-bold mb-3">Simple Pricing</h1>
        <p className="text-gray-400 light:text-txSecondary mb-14">
          Choose the plan that fits your needs
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Free Plan */}
          <div className="rounded-2xl border border-white/10 bg-primaryD light:bg-black/10 shadow-2xl p-8 backdrop-blur">
            <span className="inline-block mb-3 px-4 py-1 text-xs font-semibold rounded-full bg-secondaryD light:bg-primary">
                Free
              </span>
            <h2 className="text-2xl font-semibold mb-2">Free</h2>
            <p className="text-4xl font-bold mb-6">₹0 (Free)</p>

            <ul className="space-y-4 text-gray-300 light:text-txSecondary mb-8 text-left">
              <li className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg" />
                Create & read posts
              </li>
              <li className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg" />
                Basic editor
              </li>
              <li className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg" />
                Image upload
              </li>
              <li className="flex items-center gap-3">
                <AiOutlineClose className="text-red-400 text-lg" />
                Ads included
              </li>
              <li className="flex items-center gap-3">
                <AiOutlineClose className="text-red-400 text-lg" />
                AI generation
              </li>
            </ul>

            <button className="cursor-not-allowed w-full py-3 rounded-xl block  border-white/10 font-bold  transition bg-secondaryD/50 light:bg-logo2/50" >
              Get Started
            </button>
          </div>

          {/* Plus Plan */}
          <div className="relative rounded-2xl p-[2px]">
            {/* Animated Gradient Border */}
            <div
              className="absolute inset-0 rounded-2xl scale-101 blur-[8px]"
              style={{
                background:`conic-gradient(
                      from ${angle}deg,
                      skyblue,
                      cyan,
                      #22D3EE,
                      transparent
                    )`,
              }}
            ></div>

            {/* Inner Card */}
            <div className="relative rounded-2xl bg-primaryD light:bg-white backdrop-blur p-8">
              {/* Badge */}
              <span className="
                inline-block mb-3 px-4 py-1 text-xs font-semibold rounded-full
                bg-cyan-500/20 text-cyan-300
                light:bg-cyan-100 light:text-cyan-700
              ">
                Popular
              </span>

              {/* Title */}
              <h2 className="text-2xl font-semibold mb-2">Plus</h2>

              {/* Price */}
              <p className="text-4xl font-bold mb-6">₹499/month</p>

              {/* Features */}
              <ul className="space-y-4 text-gray-300 light:text-txSecondary mb-8 text-left">
                <li className="flex items-center gap-3">
                  <AiOutlineCheck className="text-green-400 text-lg" />
                  Everything in Free
                </li>

                <li className="flex items-center gap-3">
                  <AiOutlineCheck className="text-green-400 text-lg" />
                  10 AI credits /month
                </li>

                <li className="flex items-center gap-3">
                  <AiOutlineCheck className="text-green-400 text-lg" />
                  AI text generation (1 credit)
                </li>

                <li className="flex items-center gap-3">
                  <AiOutlineCheck className="text-green-400 text-lg" />
                  AI image generation (2 credits)
                </li>

                <li className="flex items-center gap-3">
                  <AiOutlineCheck className="text-green-400 text-lg" />
                  Ad-free experience
                </li>
              </ul>

              {/* Button */}
              <button
                className="
                  active:scale-95 w-full py-3 rounded-xl font-semibold
                  bg-gradient-to-r from-blue-600 to-cyan-600
                  hover:from-cyan-600 hover:to-cyan-300
                  text-white transition
                "
                onClick={()=>{
                  user.plan!=="Pro"?startPayment("Plus" ,isAuth):toast.info("You are already a Pro Member! Enjoy")}
                }
              >
                Upgrade to Plus
              </button>
            </div>
          </div>


          {/* Pro Plan */}
            <div className="relative rounded-2xl p-[2px]">
              {/* Animated Gradient Border */}
              <div
              className="absolute inset-0 rounded-2xl scale-101 blur-[8px]"
              style={{
              background: `${dark?`conic-gradient(from ${angle}deg,orange, #FF6900,transparent)`:`conic-gradient(from ${angle}deg,violet, #8639D3,transparent)`}`,
              }}
          ></div>
            {/* Inner Card */}
            <div className="relative rounded-2xl bg-primaryD light:bg-white  backdrop-blur p-8">
              <span className="inline-block mb-3 px-4 py-1 text-xs font-semibold rounded-full bg-logo light:bg-logo2">
                BEST VALUE
              </span>

              <h2 className="text-2xl font-semibold mb-2">Pro</h2>
              <p className="text-4xl font-bold mb-6">₹4,999/year</p>

              <ul className="space-y-4 text-gray-300 light:text-txSecondary mb-8 text-left">
                <li className="flex items-center gap-3">
                  <AiOutlineCheck className="text-green-400 text-lg" />
                  Everything in Free
                </li>
                <li className="flex items-center gap-3">
                  <AiOutlineCheck className="text-green-400 text-lg" />
                  Ad-free experience
                </li>
                <li className="flex items-center gap-3">
                  <AiOutlineCheck className="text-green-400 text-lg" />
                  AI text generation
                </li>
                <li className="flex items-center gap-3">
                  <AiOutlineCheck className="text-green-400 text-lg" />
                  AI image generation
                </li>
                <li className="flex items-center gap-3">
                  <AiOutlineCheck className="text-green-400 text-lg" />
                  Priority features
                </li>
              </ul>
            
                  {/* Button */}
                  <button className=" active:scale-97 relative z-10 w-full border border-white/10 py-3 rounded-xl light:bg-logo2/50 bg-triaryD text-logo hover:text-white light:hover:text-primaryD  hover:bg-logo  light:text-black  light:hover:bg-logo2 transition font-semibold "
                      onClick={()=>{user.plan!=="Pro"?startPayment("Pro" ,isAuth):toast.info("You are already a Pro Member! Enjoy")}}

                  >
                      Upgrade to Pro
                  </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Pricing;
