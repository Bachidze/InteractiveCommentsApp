"use client"
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

interface ReplyState {
    [key: number]: { visible: boolean; replyText: string };
  }

interface SubmittedReplies {
  [key: number]: { id: number; text: string }[];
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

  const [replyState, setReplyState] = useState<ReplyState>(
    cardData.reduce((acc: ReplyState, card: CardData) => ({
      ...acc,
      [card.id]: { visible: false, replyText: "" }
    }), {})
  );
  const [submittedReplies, setSubmittedReplies] = useState<SubmittedReplies>(
    cardData.reduce((acc: SubmittedReplies, card: CardData) => ({
      ...acc,
      [card.id]: []
    }), {})
  );

  const [editingReply, setEditingReply] = useState<{ cardId: number; replyIndex: number } | null>(null);

  const handleIncrease = (id: number) => {
    if (!clickState[id].hasUpvoted) {
      setVotes((prev) => ({
        ...prev,
        [id]: prev[id] + 1,
      }));
      setClickState((prev) => ({
        ...prev,
        [id]: {
          hasUpvoted: true,
          hasDownvoted: prev[id].hasDownvoted ? false : prev[id].hasDownvoted
        },
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
        [id]: {
          hasDownvoted: true,
          hasUpvoted: prev[id].hasUpvoted ? false : prev[id].hasUpvoted
        },
      }));
    }
  };

  const toggleReplyInput = (id: number) => {
    setReplyState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        visible: !prev[id].visible,
      },
    }));
  };

  const handleReplyChange = (id: number, text: string) => {
    setReplyState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        replyText: text,
      },
    }));
  };

  const handleReplySubmit = (id: number) => {
    const replyText = replyState[id].replyText.trim();
    if (replyText !== "") {
      setSubmittedReplies((prev) => {
        const newReplies = [...prev[id], { id: Date.now(), text: replyText }];
        return { ...prev, [id]: newReplies };
      });

      setReplyState((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          replyText: "",
        },
      }));
    }
  };

  const handleEditReply = (cardId: number, replyIndex: number) => {
    const replyToEdit = submittedReplies[cardId][replyIndex];
    setReplyState((prev) => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        replyText: replyToEdit.text,
      },
    }));
    setEditingReply({ cardId, replyIndex });
  };

  const handleUpdateReply = (cardId: number) => {
    const replyText = replyState[cardId].replyText.trim();
    if (replyText === "") {
      // Remove the reply if it's an empty string
      const updatedReplies = submittedReplies[cardId].filter((_, idx) => idx !== editingReply?.replyIndex);
      setSubmittedReplies((prev) => ({
        ...prev,
        [cardId]: updatedReplies,
      }));
    } else {
      // Ensure editingReply is not null before using it
      if (editingReply) {
        const updatedReplies = [...submittedReplies[cardId]];
        updatedReplies[editingReply.replyIndex].text = replyText;
        setSubmittedReplies((prev) => ({
          ...prev,
          [cardId]: updatedReplies,
        }));
      }
    }
  
    // Clear editing state and reply text
    setEditingReply(null);
    setReplyState((prev) => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        replyText: "",
      },
    }));
  };

  const handleKeyDown = (id: number, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();  // Prevent default Enter behavior (e.g., form submission)
      if (editingReply) {
        handleUpdateReply(id);
      } else {
        handleReplySubmit(id);  // Call the reply submit function to log or process the reply
      }
    }
  };

  const handleCloseReplyInput = (id: number) => {
    setReplyState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        visible: false,
        replyText: "",  // Clear text when closing
      },
    }));
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
                <button
                  onClick={() => toggleReplyInput(el.id)}
                  className="text-[16px] text-[#5357B6] leading-6 font-medium"
                >
                  Reply
                </button>
              </div>
            </div>

            {replyState[el.id]?.visible && (
              <div className="mt-4">
                <textarea
                  value={replyState[el.id]?.replyText}
                  onChange={(e) => handleReplyChange(el.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(el.id, e)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Write your reply here..."
                />
              </div>
            )}

            {replyState[el.id]?.visible && (
              <button
                onClick={() => handleCloseReplyInput(el.id)}
                className="mt-2 text-sm text-[#5357B6] underline"
              >
                Close
              </button>
            )}

            {/* Render submitted replies */}
            {submittedReplies[el.id]?.length > 0 && (
              <div className="mt-4 text-gray-700">
                <h4 className="font-medium">Replies:</h4>
                <ul className="list-disc pl-4">
                  {submittedReplies[el.id].map((reply, idx) => (
                    <li key={reply.id} className="text-sm flex justify-between">
                      <span>{reply.text}</span>
                      <button
                        onClick={() => handleEditReply(el.id, idx)}
                        className="text-blue-500 text-xs ml-2"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
