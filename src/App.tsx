import "./App.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import axios from "axios";
import { Error } from "./error";

const maxPages = 10;
const GET_USER_API =
  "https://ro3ll05sjd.execute-api.us-east-1.amazonaws.com/dev";

function App(props: any) {
  const [activePageNum, setActivePageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    navigation: [] as number[],
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = getUserToken();
      if (token) {
        try {
          const body = await apiCall(token);
          setUserData({
            name: body?.user,
            email: body?.email,
            navigation: body.navigation || [],
          });
        } catch (error) {
          console.error({ error });
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const updateTab = async (index: number): Promise<void> => {
    setActivePageNum(index);
    userData.navigation.push(index);
    await apiCall(getUserToken(), userData.navigation);
  };

  const getUserToken = (): string =>
    new URLSearchParams(window.location.search).get("token") || "";

  const isActivePage = (pageInd: number) => pageInd + 1 === activePageNum;
  const apiCall = async (
    token: string,
    navigation?: number[]
  ): Promise<Record<string, any>> => {
    const reqBody: { token: string; navigation?: number[] } = { token };
    if (navigation) {
      reqBody.navigation = navigation;
    }

    const resp = await axios.post(GET_USER_API, reqBody, {
      headers: {
        "x-api-key": "a0wZN5SgZ15B8lP5YIgWT2OcM59bm7He5glddaQc",
      },
    });
    return JSON.parse(resp.data?.body || "{}");
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  console.log({ userData });

  if (!userData?.name) {
    return <Error />;
  }

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
                onClick={() => updateTab(index + 1)}
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
                updateTab(activePageNum + 1);
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
