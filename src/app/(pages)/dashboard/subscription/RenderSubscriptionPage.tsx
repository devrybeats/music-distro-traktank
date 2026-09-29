"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { features } from "@/data/data";
import CurrencySelectorComponent from "@/components/common/CurrencySelector";
import { toast } from "react-toastify";
import { type Subscriptions } from "@prisma/client";
import axios from "@/libs/axios";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

type CartItem = {
  id: string;
  userId: string;
  productId: string;
  product: string;
  description: string;
  price: number;
  price_in_usd: number; // Added this line
  quantity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type SubscriptionPlanProps = {
  userSubscription: Subscriptions | null;
};

const RenderSubscriptionPage = ({
  userSubscription,
}: SubscriptionPlanProps) => {
  const [currency, setCurrency] = useState<string | null>("NGN");
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const handleAddToCart = async (item: CartItem) => {
    if (
      userSubscription?.expiresAt &&
      userSubscription.expiresAt > new Date()
    ) {
      toast.error("You Have An Existing Subscription", {
        position: "top-right",
      });
      router.push("/dashboard");
    } else {
      const res = await axios.post(`api/cart`, {
        ...item,
        user_id: session?.user?.id,
      });

      if (res.data) {
        toast.success("Subscription Added to Cart", {
          position: "top-right",
        });
        await queryClient.invalidateQueries({
          queryKey: ["cart", session?.user.id],
        });
        router.push("/dashboard/cart");
      } else {
        toast.error("Failed to Add Subscription to Cart", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <>
      <section className="mt-32">
        <div className="pb-20">
          <div className="text-center">
            <h1 className="my-2 text-4xl">Select your subscription plan</h1>
            <h5 className="">
              Choose a plan that works best for you and your music career
            </h5>
          </div>
          <section className="my-10 flex justify-center gap-4 capitalize">
            <p>selected preferred currency</p>
            <div className="w-16">
              <CurrencySelectorComponent
                currency={currency}
                setCurrency={setCurrency}
              />
            </div>
          </section>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`border px-7 py-6 duration-1000 hover:scale-105 ${
                  index === 1 &&
                  "bg-gradient-to-r from-backgroundTo from-15% via-black via-30% to-black to-90% text-white"
                }`}
              >
                {index === 1 ? (
                  <div className="text-right">
                    <p className="inline-block bg-primary px-2 py-1 text-[10px]">
                      Popular Plan
                    </p>
                  </div>
                ) : (
                  <div className="py-3" />
                )}
                <h3>{feature.product}</h3>
                <div className="my-2 flex items-center gap-2">
                  {currency === "USD" ? (
                    <h1>${feature.price_in_usd}</h1>
                  ) : (
                    <h1>₦{feature.price}</h1>
                  )}
                  <p>Per Year</p>
                </div>
                <h6 className="font-light">{feature.description}</h6>
                <div className="my-3 flex flex-col">
                  <button
                    className={`py-3 text-white ${
                      index === 1 ? "bg-primary" : "bg-black"
                    }`}
                    onClick={() =>
                      handleAddToCart(feature as unknown as CartItem)
                    }
                  >
                    <p>Subscribe</p>
                  </button>
                </div>
                <div className="mt-6">
                  <h3 className="mb-3 font-bold">Features</h3>
                  <ul className="mb-10 flex flex-col gap-2">
                    {feature.features.map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <BsFillPatchCheckFill className="text-primary" />
                        <p className="text-lg">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default RenderSubscriptionPage;
