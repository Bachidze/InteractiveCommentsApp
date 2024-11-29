"use client";
import Image from "next/image";
import React, { useState } from "react";
import CurlyGirl from "../../../public/assets/CurlyOval.svg";
import ReplyImg from "../../../public/assets/purpleReplyIcon.svg";
import cardData from "../../../json/cardData.json";

interface CardData {
  id: number;
  image: string;
  name: string;
  Date: string;
  ParaGraph: string;
  IncreaseNumber: number;
  replyText: string;
}

interface Votes {
  [key: number]: number; 
}

interface ClickState {
  [key: number]: {
    hasUpvoted: boolean;
    hasDownvoted: boolean;
  };
}

export default function Card() {
  const [votes, setVotes] = useState<Votes>(
    cardData.reduce((acc: Votes, card: CardData) => ({ ...acc, [card.id]: card.IncreaseNumber }), {})
  );


  const [clickState, setClickState] = useState<ClickState>(
    cardData.reduce((acc: ClickState, card: CardData) => ({
      ...acc,
      [card.id]: { hasUpvoted: false, hasDownvoted: false }
    }), {})
  );

  const handleIncrease = (id: number) => {
    if (!clickState[id].hasUpvoted) {
      setVotes((prev) => ({
        ...prev,
        [id]: prev[id] + 1,
      }));
      setClickState((prev) => ({
        ...prev,
        [id]: { ...prev[id], hasUpvoted: true },
      }));
    }
  };

  const handleDecrease = (id: number) => {
    if (!clickState[id].hasDownvoted) {
      setVotes((prev) => ({
        ...prev,
        [id]: prev[id] > 0 ? prev[id] - 1 : 0, 
      }));
      setClickState((prev) => ({
        ...prev,
        [id]: { ...prev[id], hasDownvoted: true },
      }));
    }
  };

  return (
    <section className="flex flex-col gap-4">
      {cardData.map((el) => (
        <div key={el.id} className="bg-white rounded-lg">
          <div className="flex py-4 mx-4 flex-col">
            <div className="flex gap-4 items-center">
              <Image
                src={CurlyGirl}
                alt="UserImg"
                className="w-[32px] h-[32px]"
              />
              <h1 className="text-[#334253] text-[16px] font-bold leading-5">
                {el.name}
              </h1>
              <h2 className="text-[#67727E] text-[16px] leading-6">
                {el.Date}
              </h2>
            </div>

            <div className="text-[#67727E] text-[16px] leading-6 py-4 w-[95%]">
              {el.ParaGraph}
            </div>

            <div className="flex justify-between items-center">
              <div className="bg-[#ebedf5] flex gap-4 px-4 py-[10px] rounded-[10px]">
                <button
                  onClick={() => handleIncrease(el.id)}
                  className={`text-[#C5C6EF] text-[16px] leading-5 cursor-pointer ${clickState[el.id].hasUpvoted ? 'cursor-not-allowed text-gray-400' : ''}`}
                  disabled={clickState[el.id].hasUpvoted}
                >
                  +
                </button>
                <h3 className="text-[16px] text-[#5357B6] leading-5">
                  {votes[el.id] || el.IncreaseNumber}
                </h3>
                <button
                  onClick={() => handleDecrease(el.id)}
                  className={`text-[#C5C6EF] text-[16px] leading-5 cursor-pointer ${clickState[el.id].hasDownvoted ? 'cursor-not-allowed text-gray-400' : ''}`}
                  disabled={clickState[el.id].hasDownvoted}
                >
                  -
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src={ReplyImg}
                  alt="ReplyImg"
                  className="w-[14px] h-[14px]"
                />
                <h4 className="text-[16px] text-[#5357B6] leading-6 font-medium">
                  {el.replyText}
                </h4>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
