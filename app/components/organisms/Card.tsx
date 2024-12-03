"use client"
import React, { FormEvent, useState } from "react";
import Image from "next/image";
import CurlyGirl from "../../../public/assets/CurlyOval.svg";
import ReplyImg from "../../../public/assets/purpleReplyIcon.svg";
import cardData from "../../../json/cardData.json";

interface cardInterFace {
  id: number;
  Date: string;
  ParaGraph: string;
  name: string;
  image: string;
  IncreaseNumber: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

export default function Card() {
  const [textarea, setTextArea] = useState("");
  const [card, setCard] = useState<cardInterFace[]>(cardData);
  const [editCardId, setEditCardId] = useState<number | null>(null);
  const GirlImage = "/assets/CurlyOval.svg";

  // Add new card
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (textarea.trim()) {
      const newCardObj = {
        id: card.length + 1, // Or use a better unique ID generator
        Date: new Date().toLocaleDateString(),
        ParaGraph: textarea,
        name: "New User",
        image: GirlImage,
        IncreaseNumber: 0,
        hasUpvoted: false,
        hasDownvoted: false,
      };
      setCard((prev) => [...prev, newCardObj]);
      setTextArea(""); // Clear the textarea after adding
    }
  };

  // Delete card
  const handleDelete = (id: number) => {
    setCard((prev) => prev.filter((el) => el.id !== id));
  };

  // Edit card
  const handleUpdate = (id: number) => {
    setEditCardId(id);
    const cardToEdit = card.find((el) => el.id === id);
    if (cardToEdit) setTextArea(cardToEdit.ParaGraph);
  };

  const saveUpdate = (id: number) => {
    if (textarea.trim()) {
      setCard((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ParaGraph: textarea } : el))
      );
    }
    setEditCardId(null); // Exit edit mode
    setTextArea(""); // Clear the textarea after saving
  };

  // Handle upvote
  const handleUpvote = (id: number) => {
    setCard((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          if (el.hasDownvoted) {
            return {
              ...el,
              IncreaseNumber: el.IncreaseNumber + 1,
              hasUpvoted: true,
              hasDownvoted: false,
            };
          }
          if (!el.hasUpvoted) {
            return {
              ...el,
              IncreaseNumber: el.IncreaseNumber + 1,
              hasUpvoted: true,
            };
          }
        }
        return el;
      })
    );
  };

  // Handle downvote
  const handleDownvote = (id: number) => {
    setCard((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          if (el.hasUpvoted) {
            return {
              ...el,
              IncreaseNumber: el.IncreaseNumber - 1,
              hasUpvoted: false,
              hasDownvoted: true,
            };
          }
          if (!el.hasDownvoted) {
            return {
              ...el,
              IncreaseNumber: el.IncreaseNumber - 1,
              hasDownvoted: true,
            };
          }
        }
        return el;
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as never);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      {card.map((el) => (
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
                  className="text-[#C5C6EF] text-[16px] leading-5 cursor-pointer"
                  onClick={() => handleUpvote(el.id)}
                  disabled={el.hasUpvoted}
                >
                  +
                </button>
                <h3 className="text-[16px] text-[#5357B6] leading-5">
                  {el.IncreaseNumber}
                </h3>
                <button
                  className="text-[#C5C6EF] text-[16px] leading-5 cursor-pointer"
                  onClick={() => handleDownvote(el.id)}
                  disabled={el.hasDownvoted}
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
                <button className="text-[16px] text-[#5357B6] leading-6 font-medium">
                  Reply
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(el.id)}
                  className="text-[#eb5f5f] text-[16px] leading-6 font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleUpdate(el.id)}
                  className="text-[#5357B6] text-[16px] leading-6 font-medium"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Only show the Add Comment form when not editing */}
      {!editCardId && (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg pb-4">
            <div className="flex justify-center">
              <textarea
                name="comment"
                placeholder="Add Comment"
                value={textarea}
                onKeyDown={handleKeyDown}
                onChange={(e) => setTextArea(e.target.value)}
                className="w-[90%] p-6 m-4 rounded-[10px] outline-none border"
              />
            </div>
            <div className="flex justify-center gap-4 mb-4">
              <button
                type="submit"
                className="bg-[#5357B6] text-white py-2 px-4 rounded-[10px]"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Only show the Update form when in edit mode and textarea is not empty */}
      {editCardId && textarea && (
        <div className="bg-white p-4 rounded-lg">
          <textarea
            value={textarea}
            onChange={(e) => setTextArea(e.target.value)}
            className="w-[90%] p-6 m-4 rounded-[10px] outline-none border"
          />
          <div className="flex gap-3">
            <button
              onClick={() => saveUpdate(editCardId)}
              className="bg-[#5357B6] py-2 px-4 rounded-[10px] text-white"
            >
              Save
            </button>
            <button
              onClick={() => setEditCardId(null)}
              className="bg-[#eb5f5f] py-2 px-4 rounded-[10px] text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
