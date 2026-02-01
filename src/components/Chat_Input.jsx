import { useRef, useState, useEffect } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import { socket } from "../socket.js";
import { getRewriteByAi, host } from "../utils/ApiRoutes";
import axios from "axios";
import { OrbitProgress } from "react-loading-indicators";
import { SyncLoader } from "react-spinners";

export default function Chat_Input({ handleSendMessage, currchat }) {
  const [isclickemoji, setisclickemoji] = useState(false);
  const [useremoji, setuseremoji] = useState(null);
  const [userInput, setuserInput] = useState("");

  // const [previewText,setpreviewText] = useRef(null)
  let [hideSend, sethideSend] = useState(true);
  let [loading, setLoading] = useState(false);
  let preview_msg = useRef(null);

  const click_emoji = () => {
    setisclickemoji(!isclickemoji);
  };

  const choosen_emoji = (emojidata) => {
    setuserInput(userInput + emojidata.emoji);
  };

  const Input_change = (event) => {
    setuserInput(event.target.value);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (userInput.length > 0) {
      handleSendMessage(userInput);
      setuserInput("");
    }
  };

  const handleRewrite = async () => {
    try {
      if (userInput) {
        preview_msg.data = userInput;
        setLoading(true);

        const response = await axios.post(getRewriteByAi, {
          user_message: userInput,
        });

        setLoading(false);

        sethideSend(false);
        if (response.data.status) {
          setuserInput(response.data.aiRewriteMsg);
        } else {
          console.log(`error in ${response.data.error}`);
        }
      }
    } catch (ex) {
      console.log(`Error in handle rewrite ${ex}}`);
    }
  };

  const handlePreviewBtn = async (event) => {
    if (event.target.textContent === "close") {
      setuserInput(preview_msg.data);
      sethideSend(true);
    } else if (event.target.textContent === "regenerate") {
      setLoading(true);
      await handleRewrite();
      setLoading(false);
    } else {
      setuserInput(userInput);
      sethideSend(true);
    }
  };

  return (
    <>
      <div className="container flex justify-center items-center   px-8  relative overflow-visible w-[70vw] mb-4 ">
        <div className="Input_field flex justify-center items-center w-[60vw]   p-[0.3rem] rounded-[2rem] gap-[0.5rem] bg-[#21212a]  ">
          <div className="button_container flex items-center justify-center text-white">
            <div className="emoji relative">
              <BsEmojiSmileFill
                onClick={click_emoji}
                className="text-2xl text-[#ffff00c8] cursor-pointer"
              />

              {isclickemoji && (
                <div className="absolute bottom-full mb-3 left-0 z-50">
                  <EmojiPicker
                    className=""
                    searchDisabled
                    theme={Theme.DARK}
                    onEmojiClick={choosen_emoji}
                    width={300}
                    height={300}
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              )}
            </div>
          </div>

          <form
            className="input_container w-[50vw] h-[5vh] flex justify-center items-center"
            onSubmit={(e) => {
              sendChat(e);
            }}
          >
            <textarea
              className="w-full bg-transparent text-white border-none pl-4  text-lg focus:outline-none overflow-hidden resize-none "
              rows={1}
              placeholder="Type Message"
              value={userInput}
              onChange={Input_change}
            />

            {hideSend && (
              <button
                type="submit"
                className={`send_message p-3 rounded-full flex justify-center items-center  ${
                  userInput === "" ? "" : "bg-[#6b4beb] "
                }`}
              >
                <IoMdSend className="text-white text-xl" />
              </button>
            )}
          </form>

          {!hideSend ? (
            <div className="previewBtn flex gap-3 text-[white]">
              <div className="generate_Btn p-3 rounded-full flex justify-center items-center bg-[#6d4beb]">
                {!loading ? (
                  <button
                    className=""
                    onClick={(event) => handlePreviewBtn(event)}
                  >
                    regenerate
                  </button>
                ) : (
                  <div className=" bg-[#6b4beb] p-1 rounded-full flex items-center justify-center">
                    <SyncLoader loading={true} color="#ffff" size={10} />
                  </div>
                )}
              </div>

              <button
                className="p-3 rounded-full flex justify-center items-center bg-[#6d4beb]"
                onClick={(event) => handlePreviewBtn(event)}
              >
                close
              </button>

              <button
                className="p-3 rounded-full flex justify-center items-center bg-[#6d4beb]"
                onClick={() => handlePreviewBtn(event)}
              >
                Accept
              </button>
            </div>
          ) : (
            <>
              {loading ? (
                <div className=" bg-[#6b4beb] p-[0.7rem] rounded-full flex items-center justify-center">
                  <SyncLoader loading={true} color="#ffff" size={10} />
                </div>
              ) : (
                <div
                  onClick={handleRewrite}
                  className={`${
                    userInput === "" ? "" : "bg-[#6b4beb]"
                  }  text-[white] p-[0.7rem] rounded-full flex justify-center items-center cursor-pointer`}
                >
                  Rewrite
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
