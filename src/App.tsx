import "./App.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const maxPages = 10;

function App() {
  const [activePageNum, setActivePageNum] = useState(1);

  const isActivePage = (pageInd: number) => pageInd + 1 === activePageNum;

  return (
    <div className="App">
      <div className="header">
        <FontAwesomeIcon
          icon={solid("bars")}
          color="black"
          style={{ width: 30, height: 30 }}
          className="clickable"
        />
        <div>
          <FontAwesomeIcon
            icon={solid("comments")}
            color="navy"
            style={{ width: 30, height: 30, marginRight: 50 }}
            className="clickable"
          />

          <FontAwesomeIcon
            icon={solid("user")}
            color="navy"
            style={{ width: 30, height: 30 }}
            className="clickable"
          />
        </div>
      </div>
      <div className="center-section">
        <div className="center-left-pane">
          {Array(maxPages)
            .fill(0)
            .map((_, index) => (
              <div
                role="button"
                key={index}
                aria-pressed="false"
                tabIndex={0}
                className={
                  "clickable tab" + (isActivePage(index) ? " tab-active" : "")
                }
                onClick={() => setActivePageNum(index + 1)}
              >
                {index + 1}
              </div>
            ))}
        </div>
        <div className="body">
          <div className="body-content"></div>
        </div>
      </div>

      <div className="footer">
        <div className="footer-icon">
          <FontAwesomeIcon
            icon={solid("message")}
            color="navy"
            style={{ width: 30, height: 30 }}
            className="clickable"
          />
        </div>
        <div className="footer-navigation">
          <span style={{ width: 150, textAlign: "left" }}>
            Item {activePageNum} of {maxPages}
          </span>
          <FontAwesomeIcon
            icon={solid("forward-step")}
            color={activePageNum < maxPages ? "navy" : "grey"}
            style={{ width: 30, height: 30 }}
            onClick={() => {
              if (activePageNum < maxPages) {
                setActivePageNum((curr) => curr + 1);
              }
            }}
            className={
              "clickable" + (activePageNum >= maxPages ? " disabled" : "")
            }
          />
        </div>
      </div>
    </div>
  );
}

export default App;
