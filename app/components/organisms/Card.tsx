"use client";
import Image from "next/image";
import React, { useState } from "react";
import CurlyGirl from "../../../public/assets/CurlyOval.svg";
import ReplyImg from "../../../public/assets/purpleReplyIcon.svg";
import cardData from "../../../json/cardData.json";

export default function Card() {
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
                <button className="text-[#C5C6EF] text-[16px] leading-5 cursor-pointer">
                  +
                </button>
                <h3 className="text-[16px] text-[#5357B6] leading-5">
                  {el.IncreaseNumber}
                </h3>
                <button className="text-[#C5C6EF] text-[16px] leading-5 cursor-pointer">
                  -
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Image
                  src={ReplyImg}
                  alt="ReplyImg"
                  className="w-[14px] h-[14px]"
                />
                <button className="text-[16px] text-[#5357B6] leading-6 font-medium">
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-white rounded-lg pb-4">
        <div className="flex justify-center">
          <textarea
            name="comment"
            placeholder="Add Comment"
            className="w-[90%] p-6 m-4 rounded-[10px] outline-none border"
          />
        </div>
        <div className="flex items-center justify-between w-[90%] m-auto">
          <div>
            <Image className="w-[50px] h-[50px]" alt="mainAvatar" src={CurlyGirl} />
          </div>
          <div>
            <button className="bg-[#5357B6] py-4 px-6 rounded-[10px] text-white">
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
