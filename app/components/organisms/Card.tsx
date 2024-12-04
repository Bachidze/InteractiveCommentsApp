"use client";
import React, { FormEvent, useState } from "react";
import Image from "next/image";
import CurlyGirl from "../../../public/assets/CurlyOval.svg";
import ReplyImg from "../../../public/assets/purpleReplyIcon.svg";
import cardData from "../../../json/cardData.json";

interface Reply {
  id: number;
  text: string;
  name: string;
  date: string;
}

interface cardInterFace {
  id: number;
  Date: string;
  ParaGraph: string;
  name: string;
  image: string;
  IncreaseNumber: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  replies: Reply[];
}

export default function Card() {
  const [textarea, setTextArea] = useState("");
  const [card, setCard] = useState<cardInterFace[]>(cardData);
  const [editCardId, setEditCardId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const GirlImage = "/assets/CurlyOval.svg";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (textarea.trim()) {
      const newCardObj = {
        id: card.length + 1,
        Date: new Date().toLocaleDateString(),
        ParaGraph: textarea,
        name: "New User",
        image: GirlImage,
        IncreaseNumber: 0,
        hasUpvoted: false,
        hasDownvoted: false,
        replies: [],
      };
      setCard((prev) => [...prev, newCardObj]);
      setTextArea("");
    }
  };

  const handleDelete = (id: number) => {
    setCard((prev) => prev.filter((el) => el.id !== id));
  };

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

    setEditCardId(null);
  };

  const handleCancel = () => {
    setEditCardId(null);
    setTextArea("");
  };

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

  const handleReplySubmit = (cardId: number, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (replyText.trim()) {
      const newReply: Reply = {
        id: Date.now(),
        text: replyText,
        name: "New User",
        date: new Date().toLocaleDateString(),
      };

      setCard((prev) =>
        prev.map((el) =>
          el.id === cardId ? { ...el, replies: [...el.replies, newReply] } : el
        )
      );
      setReplyText(""); // Clear the reply input
    }
  };

  const handleEditReply = (replyId: number, cardId: number) => {
    const replyToEdit = card
      .find((el) => el.id === cardId)
      ?.replies.find((rep) => rep.id === replyId);
    if (replyToEdit) {
      setEditingReplyId(replyId);
      setReplyText(replyToEdit.text);
    }
  };

  const handleSaveReply = (replyId: number, cardId: number) => {
    if (replyText.trim()) {
      setCard((prev) =>
        prev.map((el) =>
          el.id === cardId
            ? {
                ...el,
                replies: el.replies.map((rep) =>
                  rep.id === replyId ? { ...rep, text: replyText } : rep
                ),
              }
            : el
        )
      );
      setReplyText("");
      setEditingReplyId(null);
    }
  };

  const handleCancelReplyEdit = () => {
    setEditingReplyId(null);
    setReplyText("");
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

            <div className="pl-6">
              {el.replies.map((reply) => (
                <div key={reply.id} className="bg-[#f1f3f8] p-4 my-2 rounded-md">
                  <div className="flex gap-4 items-center">
                    <Image
                      src={CurlyGirl}
                      alt="UserImg"
                      className="w-[32px] h-[32px]"
                    />
                    <h1 className="text-[#334253] text-[16px] font-bold leading-5">
                      {reply.name}
                    </h1>
                    <h2 className="text-[#67727E] text-[16px] leading-6">
                      {reply.date}
                    </h2>
                  </div>
                  <div className="text-[#67727E] text-[16px] leading-6 pt-2">
                    {editingReplyId === reply.id ? (
                      <div>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full p-2 text-[#67727E] text-[16px] leading-6"
                          rows={3}
                        />
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleSaveReply(reply.id, el.id)}
                            className="text-[#5357B6]"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelReplyEdit}
                            className="text-[#eb5f5f]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p>{reply.text}</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditReply(reply.id, el.id)}
                      className="text-[#5357B6] text-[16px] leading-6"
                    >
                      Edit Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply form */}
            <form onSubmit={(e) => handleReplySubmit(el.id, e)}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-2 text-[#67727E] text-[16px] leading-6"
                rows={3}
                placeholder="Write your reply..."
              />
              <button
                type="submit"
                className="text-[#5357B6] mt-2"
                disabled={!replyText.trim()}
              >
                Submit Reply
              </button>
            </form>
          </div>
        </div>
      ))}

      
      

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

      {editCardId && (
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
              onClick={handleCancel}
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
