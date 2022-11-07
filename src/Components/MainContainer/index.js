import React, { useState } from "react";
import { paragraph } from "../../Data";
import Modal from "../Modal";

import Style from "./index.module.css"

function Highlight({ children: text = "", tags = [] }) {
  if (!tags?.length) return text;

  let _tags = [];

  for (let index = 0; index < tags.length; index++) {
    const element = tags[index];

    _tags.push(element.key);
  }

  const matches = [...text.matchAll(new RegExp(_tags.join("|"), "ig"))];
  const startText = text.slice(0, matches[0]?.index);

  return (
    <span>
      {startText}
      {matches.map((match, e) => {
        const startIndex = match.index;
        const getType = tags.filter((tg) => tg.key === match)[0]?.category;
        const currentText = match[0];
        const endIndex = startIndex + currentText.length;

        const nextIndex = matches[e + 1]?.index;

        const untilNextText = text.slice(endIndex, nextIndex);
console.log(untilNextText)

        return (
          <span key={e}>
            <mark>
              {currentText}{" "}
              <span
                style={{
                  color: "red",
                  marginRight: 3,
                  border: "1px solid red",
                }}
              >
                {getType}
              </span>
            </mark>
            {untilNextText}
          </span>
        );
      })}
    </span>
  );
}

function ParasList({ activeParaId, setPara }) {
  const paragraphHanlder = (para) => {
    setPara(para);
  };
  return (
    <ul>
      {paragraph.map((para, i) => (
        <li
          style={{
            cursor: "pointer",
            textAlign: "left",
            // marginBottom: 10,
            padding: 10,
            backgroundColor: activeParaId === para.id && "#ccc",
            border: "1px solid black",
          }}
          key={i}
          onClick={() => paragraphHanlder(para)}
        >
          {para.text?.slice(0, 35)}...
        </li>
      ))}
    </ul>
  );
}

export default function MainContainer() {
  let defData = JSON.parse(localStorage.getItem("myItems"));
  let countData = JSON.parse(localStorage.getItem("totalCount"));

  const [selected, setSelected] = useState(defData ? defData : []);
  const [category, setCategory] = useState("person");
  const [isDelete, setIsDelete] = useState(false);
  const [counter, setCounter] = useState(countData ? countData: {})

  const [para, setPara] = useState(paragraph[0]);

  function getSelectedText() {
    let txt = "";
    if (window.getSelection) {
      txt = window.getSelection();
    } else if (window.document.getSelection) {
      txt = window.document.getSelection();
    } else if (window.document.selection) {
      txt = window.document.selection.createRange().text;
    }
    if (txt?.toString().length < 3) {
      // alert("min length 2 required");
      return;
    }
    

    if (txt?.toString().length > 20) {
      // alert("Max length 15 required");
      return;
    }

  

    let newArr = [...selected, { key: txt?.toString(), category }];

    localStorage.setItem("myItems", JSON.stringify(newArr));


  let countPerson = newArr?.filter((item) => item?.category === "person");

  let countOrg = newArr?.filter((item) => item?.category === "org");
  
let countedeData = {countOrg:countOrg?.length,countPerson:countPerson?.length} 
localStorage.setItem("totalCount", JSON.stringify(countedeData));

setCounter(countedeData)
  
    setSelected(newArr);



    return txt;
  }



// if(category === "person"){
  

// }
  const [deletMedata, setdeletMedata] = useState("");

  function deleteMe() {
    let remain = selected?.filter((item) => item.key !== deletMedata);
    setSelected(remain);
    handleClose();

  }

  function deleteMeData(txt) {
    setdeletMedata(txt);
    setIsDelete(true);
  }

  function handleClose() {
    // setCounter(counter-1)

    setIsDelete(false);

  }

  return (
    <div className={Style.mainContainer}>
      {isDelete && <Modal deleteMe={deleteMe} onClose={handleClose} />}

      <div className={Style.divFirst}>
        <div className={Style.cardHeader}>
          <h1>Records</h1>
        </div>
        <ParasList
          activeParaId={para?.id}
          // tags={selected}
          setPara={setPara}
        />
      </div>
      <div className={Style.divTwo}>
        <div
          style={{
            textAlign: "left",
          }}
          className={Style.cardHeader}
        >
          <button
            onClick={() => setCategory("person")}
            type="button"
            style={{
              backgroundColor: category === "person" ? "white" : "",
              border: "1px solid white",
              borderRadius: "5px",
              padding: " 0px 10px",
              color: category === "person" ? "green" : "white",

            }}
          >
            Person
{counter?.countPerson}

          </button>

          <button
            style={{
              backgroundColor: category === "org" ? "white" : "",
              marginLeft: 10,
              border: "1px solid white",
              borderRadius: "5px",
              padding: " 0px 10px",
              color: category === "org" ? "green" : "white",
            }}
            onClick={() => setCategory("org")}
            type="button"
          >
            Org
{counter?.countOrg}

          </button>
        </div>

        <h4 onMouseUp={() => getSelectedText()}>
          <Highlight tags={selected}>{para?.text}</Highlight>
        </h4>
      </div>
      <div className={Style.divThird}>
        <div className={Style.cardHeader}>
          <h1>Annotations</h1>
        </div>
        <button
          onClick={() => {
            setSelected([]);
            localStorage.removeItem("myItems");
          }}
          type="button"
          className="ml-2 mt-2  inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          CLEAR ALL
        </button>

        <h1>SELECTED LIST</h1>

        {selected.length === 0 &&
          "Select your words from the paragraph list..."}
        {selected?.map((item, index) => {
          return (
            <div
              style={{
                width: "100%",
                height: "auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                paddingTop: "10px",
              }}
            >
              <p style={{ width: "30%", textAlign: "left" }} key={index}>
                {item.key}
              </p>

              <span
                style={{
                  width: "40px",
                  color: "black",
                  marginLeft: 5,
                  borderBottom: "1px solid red",
                }}
              >
                {item.category}
              </span>
              <span
                onClick={() => deleteMeData(item.key)}
                style={{ color: "red", marginLeft: 20, cursor: "pointer" }}
              >
                X
              </span>
            </div>
          );
        })}
      </div>

      {/* <ParasList /> */}
    </div>
  );
}
