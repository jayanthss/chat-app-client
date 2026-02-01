import { useState, useEffect, useRef } from "react";
import Logo from "./../assets/logo.svg";

function Contacts({ contacts, curruser ,currchat ,onlineUser}) {


  const [currUsername, setcurrUsername] = useState(undefined);
  const [currUserImage, setcurrUserImage] = useState(undefined);
  const [currSelected, setcurrSelected] = useState(0);
  const countRef = useRef(false)

  useEffect(() => {
    if (curruser) {
      setcurrUserImage(curruser.avatarImage);
      setcurrUsername(curruser.username);
    }
  }, [curruser]);

  useEffect(() => {
    if (!countRef.current && contacts.length > 0) {
      currchat(contacts[0]);
      countRef.current = true;
    }
  }, [contacts, currchat]);

  const changeCurrChat = (index,contact) => {

    setcurrSelected(index)
    currchat(contact)
  };

  return (
    <>
      {currUserImage && currUsername && (
        <div className="cointainer grid grid-rows-[10%_8%_82%] overflow-hidden bg-[#121217]">
          
          <div className="Brand flex items-center ml-9 gap-[1rem]  border-solid border-[#1E293B] border-r-[1px]">
            <img className="h-[2.1rem]" src={Logo} alt="logo" />
            <h3 className="text-[white] uppercase font-extrabold text-[20px] ">SuperChat</h3>
          </div>

          <div className="search flex flex-col justify-center items-center  border-t-[1px] border-solid border-[#1E293B] border-r-[1px] pt-3">

            <input className=" focus:border-[#1E1B4B] focus:outline-none bg-[hsl(221.25deg,15.69%,20%)] text-white rounded-lg p-2 w-[80%] " type="text" placeholder="Search friend" />
          </div>

          <div className="contacts flex flex-col items-center overflow-auto gap-[0.8rem] custom-scrollbar pt-4 border-solid border-[#1E293B] border-r-[1px]">
            
            {contacts.map((contact, index) => {
              const onlineusers = new Set(onlineUser)
              let isOnline = onlineusers.has(contact._id)
             
                return (
                  <div
                  className={`${
                    index === currSelected ? "bg-[#1E1B4B]" : ""
                  }  min-h-[5rem] w-[90%] cursor-pointer rounded-[1rem] p-[0.4rem] gap-[1rem] flex items-center transition duration-[500] ease-in-out justify-between ${index === currSelected ? "":"hover:bg-[#1b1b22]"}` }
                  key={index} onClick={()=>{changeCurrChat(index,contact)}}
                >
                  <div className="avatar_username flex items-center p-[0.4rem] gap-[1rem] ">

                  <div className="avatar ">
                    <img className="h-[3.4rem]" src={contact.avatarImage} alt="avatar" />
                  </div>
                  <div className="username">
                    <h3 className="text-[white] text-[1.3rem]">{contact.username}</h3>
                  </div>
                  </div>


                  <div className={`${onlineusers.has(contact._id) ? "bg-green-600" : ""} online  w-1 h-3 rounded-[6rem] pr-[0.6rem] mr-[0.4rem]`}></div>
                </div>
              );
            })}
          </div>

          {/* <div className="current-user bg-[#0d0d30] flex justify-center items-center gap-[2rem]">
            <div className="avatar">
              <img className="h-[4rem] max-w-full" src={currUserImage} alt="avatar" />
            </div>
            <div className="username">
              <h2 className="text-[white]">{currUsername}</h2>
            </div>
          </div> */}
        </div>
      )}
    </>
  );
}

export default Contacts;
