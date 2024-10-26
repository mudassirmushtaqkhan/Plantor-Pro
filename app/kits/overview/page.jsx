"use client";
import { useStateStore } from "@/stores/kits/store";
import Navbar from "@/components/Navbar";
import React from "react";

const Page = () => {
  return (
    <div className="h-screen">
      <main className="flex min-h-full flex-col bg-gray-300 bg-gradient-to-tl from-[#71a32f] via-green-200 to-transparent">
        <Navbar />
        <Details />
      </main>
    </div>
  );
};

const Details = () => {
  const state = useStateStore();

  // Initialize item counts in a single state object
  const [counts, setCounts] = React.useState({
    totalStacks: 0,
    midTowerRisers_1: 0,
    midTowerRisers_2: 0,
    totalRiserPipe_800: 0,
    totalRiserPipe_600: 0,
    totalRiserPipe_400: 0,
    baseStacky: 0,
    baseBag: 0,
    planterColor_Terracotta: 0,
    planterColor_Black: 0,
    planterColor_Stone: 0,
    baseColor_Black: 0,
    baseColor_Terracotta: 0,
    baseColor_Stone: 0,
    nutrientHybrid: 0,
    nutrientOrganic: 0,
  });

  // Product IDs
  const productIds = {
    totalStacksId: "36056",
    midTowerRiser_1Id: "36058",
    midTowerRiser_2Id: "36060",
    riserPipe_800Id: "36067",
    riserPipe_600Id: "36064",
    riserPipe_400Id: "36062",
    baseStackyId: "36075",
    baseBagId: "36073",
    planterColor_TerracottaId: "36047",
    planterColor_BlackId: "36049",
    planterColor_StoneId: "36051",
    nutrientHybridId: "36069",
    nutrientOrganicId: "36071",
  };

  // Generate the cart URL dynamically based on the counts
  const generateUrl = () => {
    const {
      totalStacks, midTowerRisers_1, midTowerRisers_2,
      totalRiserPipe_800, totalRiserPipe_600, totalRiserPipe_400,
      baseStacky, baseBag, planterColor_Terracotta,
      planterColor_Black, planterColor_Stone, nutrientHybrid, nutrientOrganic
    } = counts;

    const products = [
      { id: productIds.totalStacksId, quantity: totalStacks },
      { id: productIds.midTowerRiser_1Id, quantity: midTowerRisers_1 },
      { id: productIds.midTowerRiser_2Id, quantity: midTowerRisers_2 },
      { id: productIds.riserPipe_800Id, quantity: totalRiserPipe_800 },
      { id: productIds.riserPipe_600Id, quantity: totalRiserPipe_600 },
      { id: productIds.riserPipe_400Id, quantity: totalRiserPipe_400 },
      { id: productIds.baseStackyId, quantity: baseStacky },
      { id: productIds.baseBagId, quantity: baseBag },
      { id: productIds.planterColor_TerracottaId, quantity: planterColor_Terracotta },
      { id: productIds.planterColor_BlackId, quantity: planterColor_Black },
      { id: productIds.planterColor_StoneId, quantity: planterColor_Stone },
      { id: productIds.nutrientHybridId, quantity: nutrientHybrid },
      { id: productIds.nutrientOrganicId, quantity: nutrientOrganic },
    ].filter(item => item.quantity > 0);

    const addToCartParam = products.map(item => item.id).join(",");
    const quantitiesParam = products.map(item => item.quantity).join(",");

    const url = `https://staging.mrstacky.com.au/cart/?add-to-cart=${addToCartParam}&quantities=${quantitiesParam}`;

    console.log(url); // for testing purpose
    window.open(url, "_blank");
  };

  // Update counts based on the state.garden data
  React.useEffect(() => {
    let updatedCounts = { ...counts };

    state.garden.forEach((value, index) => {
      if (index === 0) return;

      updatedCounts.totalStacks += state.stacksPerTower;

      if (state.midTowerRiser === 1) updatedCounts.midTowerRisers_1++;
      if (state.midTowerRiser === 2) updatedCounts.midTowerRisers_2++;

      switch (state.riserPipe) {
        case 0.8:
          updatedCounts.totalRiserPipe_800++;
          break;
        case 0.6:
          updatedCounts.totalRiserPipe_600++;
          break;
        case 0.4:
          updatedCounts.totalRiserPipe_400++;
          break;
        default:
          break;
      }

      if (value.trolley === "stacky") updatedCounts.baseStacky++;
      if (value.trolley === "bag") updatedCounts.baseBag++;

      switch (value.color) {
        case "#D35832":
          updatedCounts.planterColor_Terracotta++;
          break;
        case "#000":
          updatedCounts.planterColor_Black++;
          break;
        case "#A8A5A1":
          updatedCounts.planterColor_Stone++;
          break;
        default:
          break;
      }

      switch (state.baseColor) {
        case "#000":
          updatedCounts.baseColor_Black++;
          break;
        case "#D35832":
          updatedCounts.baseColor_Terracotta++;
          break;
        case "#A8A5A1":
          updatedCounts.baseColor_Stone++;
          break;
        default:
          break;
      }

      state.nutrient === "hydroponic"
        ? updatedCounts.nutrientHybrid++
        : updatedCounts.nutrientOrganic++;
    });

    setCounts(updatedCounts);
  }, [state.garden]);

  return (
    <div className="relative flex flex-col gap-6 justify-center items-center w-full px-4 py-6 h-auto max-w-screen-lg mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full text-black rounded-3xl">
          <thead className="sticky top-0 bg-green-200">
            <tr className="text-xs lg:text-base font-bold border-b border-black text-left">
              <th className="p-2 md:p-4 w-auto">#</th>
              <th className="p-2 md:p-4 w-auto">Name</th>
              <th className="p-2 md:p-4 w-auto">Planter Color</th>
              <th className="p-2 md:p-4 w-auto">Base</th>
              <th className="p-2 md:p-4 w-auto">Base Color</th>
              <th className="p-2 md:p-4 w-auto">Stacks</th>
              <th className="p-2 md:p-4 w-auto">Mid tower risers</th>
              <th className="p-2 md:p-4 w-auto">Riser pipe length</th>
            </tr>
          </thead>
          <tbody>
            {state.garden.map((value, index) =>
              index > 0 ? (
                <tr key={index} className="text-xs md:text-base border-b border-black text-center">
                  <td className="p-2 md:p-4 text-left">{index}</td>
                  <td className="p-2 md:p-4 text-left">{value.name}</td>
                  <td className="p-2 md:p-4 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: value.color }} />
                    <div className="hidden md:block">{value.color}</div>
                  </td>
                  <td className="p-2 md:p-4 whitespace-nowrap text-left">{value.trolley}</td>
                  <td className="p-2 md:p-4 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: state.baseColor }} />
                    <div className="hidden md:block">{state.baseColor}</div>
                  </td>
                  <td className="p-2 md:p-4">{state.stacksPerTower}</td>
                  <td className="p-2 md:p-4">{state.midTowerRiser}</td>
                  <td className="p-2 md:p-4">{`${state.riserPipe * 1000}mm`}</td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full text-black rounded-3xl bg-green-100 p-4 mt-4">
        <h2 className="text-lg md:text-2xl font-bold text-center mb-4">Summary of Counts</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-200">
              <tr>
                <th className="p-2">Planter Color</th>
                <th className="p-2">Base</th>
                <th className="p-2">Mid Tower Risers</th>
                <th className="p-2">Total Stacks</th>
                <th className="p-2">Riser Pipe Length</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                {/* Planter Colors */}
                <td className="p-2">
                  {counts.planterColor_Black > 0 && `Black: ${counts.planterColor_Black} `}
                  {counts.planterColor_Terracotta > 0 && `| Terracotta: ${counts.planterColor_Terracotta} `}
                  {counts.planterColor_Stone > 0 && `| Stone: ${counts.planterColor_Stone}`}
                </td>

                {/* Base Types (Stacky/Bag) */}
                <td className="p-2">
                  {counts.baseStacky > 0 && `Stacky: ${counts.baseStacky} `}
                  {counts.baseBag > 0 && `| Bag: ${counts.baseBag}`}
                </td>

                {/* Mid Tower Risers */}
                <td className="p-2">
                  {counts.midTowerRisers_1 > 0 && `Riser 1: ${counts.midTowerRisers_1} `}
                  {counts.midTowerRisers_2 > 0 && `Riser 2: ${counts.midTowerRisers_2}`}
                </td>

                {/* Total Stacks */}
                <td className="p-2">
                  {counts.totalStacks > 0 ? counts.totalStacks : null}
                </td>

                {/* Riser Pipe Lengths */}
                <td className="p-2">
                  {counts.totalRiserPipe_800 > 0 && `800mm: ${counts.totalRiserPipe_800} `}
                  {counts.totalRiserPipe_600 > 0 && `600mm: ${counts.totalRiserPipe_600} `}
                  {counts.totalRiserPipe_400 > 0 && `400mm: ${counts.totalRiserPipe_400}`}
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={generateUrl}
        className="mt-4 p-4 px-6 md:px-10 text-sm md:text-lg font-bold text-black bg-green-100 rounded-full hover:bg-green-200 transition-colors ease-in-out"
      >
        Add to Cart
      </button>
    </div>
  );
};



export default Page;
