// Importing necessary dependencies and styles
import React, { useRef, useState } from "react";
import styled from "styled-components";
import "./App.css";

// Styling for the main container of the application
const AppContainer = styled.div`
  margin-left: -10px;
`;

// Styling for the container that holds draggable widgets
const WidgetsContainer = styled.div`
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  color: white;
  width: 20%;
  height: 100%;
  position: fixed;
  top: 50px;
  z-index: 100;
`;

// Styling for individual draggable widget
const Widget = styled.div`
  margin-bottom: 12px;
  padding: 8px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

// Styling for an image
const Image = styled.img`
  width: 100%;
  margin-bottom: 12px;
`;

// Styling for the main content container
const PageContainer = styled.div`
  margin-top: 50px;
  margin-left: 25%;
  padding: 20px;
  height: 100vh;
  width: 70.5%;
  overflow: auto;
`;

// Styling for the dropped text area
const DroppedText = styled.textarea`
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 10px;
`;

// Styling for an image with fixed dimensions
const Img = styled.img`
  width: 100%;
  height: 100%;
`;

// Styling for the drop box for images
const DropBox = styled.div`
  width: 20vw;
  height: 20vw;
  border: 2px dashed #aaa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    border-color: #555;
  }
`;

// Styling for the navigation bar
const NavbarContainer = styled.div`
  background-color: #3498db;
  color: white;
  padding: 10px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
`;

// Styling for the content within the navigation bar
const NavbarContent = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

// Styling for the home icon in the navigation bar
const HomeIcon = styled.div`
  font-size: 24px;
  margin-right: 10px;
`;

// Styling for the save button in the navigation bar
const SaveButton = styled.button`
  background-color: #2ecc71;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

// Main functional component for the application
const App = () => {
  // Ref for input element
  const inputRef = useRef(null);

  // State for managing widgets, image source, and text content
  const [widget, setWidget] = useState([]);
  const [imageStates, setImageStates] = useState([]);
  const [storage, setStorage] = useState([]);
  const [Text, setText] = useState([])
  // Handler for initiating text drag
  const handleOnDragText = (e, text) => {
    e.dataTransfer.setData("text", text);
  };

  // Handler for initiating image drag
  const handleOnDragImg = (e) => {
    e.dataTransfer.setData("imgType", "Image");
  };

  // Handler for dropping elements into the page container
  const handleOnDrop = (e) => {
    e.preventDefault();
    const textType = e.dataTransfer.getData("text");
    const imgType = e.dataTransfer.getData("imgType");

    if (textType === "Text") {
      setWidget([...widget, { type: textType, tag: "textarea" }]);
    } else {
      setWidget([...widget, { type: imgType, tag: "img" }]);
    }
  };

  // Handler for dragging over the page container
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handler for opening file input on image click
  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (e, ind) => {
    const file = e.target.files[0];

    setImageStates((prevStates) => {
      prevStates[ind] = file;
      setStorage([...storage, file.name]);
      return [...prevStates];
    });
  };

  // Handler for saving text to local storage
  const handleClick = () => {
    localStorage.setItem("Data", storage);
  };

  return (
    <AppContainer>
      {/* Navigation Bar */}
      <NavbarContainer>
        <NavbarContent>
          <HomeIcon>🏠</HomeIcon>
          <span style={{ fontSize: "20px" }}>Simple Website Builder</span>
          <SaveButton onClick={handleClick}>Save</SaveButton>
        </NavbarContent>
      </NavbarContainer>

      {/* Widgets Container */}
      <WidgetsContainer>
        <Widget draggable onDragStart={(e) => handleOnDragText(e, "Text")}>
          Textbox
        </Widget>
        <Image
          src="./upload.jpg"
          alt=""
          draggable
          onDragStart={(e) => handleOnDragImg(e)}
        />
      </WidgetsContainer>

      {/* Main Content Container */}
      <PageContainer onDrop={handleOnDrop} onDragOver={handleDragOver}>
        {widget.map((wid, ind) =>
          wid.tag === "textarea" ? (
            <DroppedText
              ref={inputRef}
              key={ind}
              onChange={(e) => {
                setText((prevStates) => {
                  const newStates = [...prevStates];
                  newStates[ind] = e.target.value;
                  setStorage([...storage, newStates[ind]]);
                  return newStates;
                });
              }}
            >
              {Text[ind]}
            </DroppedText>
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <DropBox onClick={handleImageClick}>
                {imageStates[ind] ? (
                  <Img src={URL.createObjectURL(imageStates[ind])} alt="" />
                ) : (
                  <Image src="./upload.jpg" alt="" />
                )}
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="files"
                  ref={inputRef}
                  onChange={(e) => handleImageChange(e, ind)}
                />
              </DropBox>
            </div>
          )
        )}
      </PageContainer>
    </AppContainer>
  );
};

export default App;
