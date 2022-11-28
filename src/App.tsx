import "./App.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import axios from "axios";
import { Error } from "./error";
import { ResponseBody } from "./api-response-types";

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
    iframes: [] as {
      title: string;
      desc: string;
      url: string;
    }[],
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = getUserToken();
      setLoading(true);

      if (token) {
        try {
          const body = await apiCall(token);
          setUserData({
            name: body?.user,
            email: body?.email,
            navigation: body?.navigation || [],
            iframes: body?.items?.map((item) => ({
              title: item?.item[0]?.appref[0]?.name,
              url: item?.item[0]?.appref[0]?.url,
              desc: item.item[0]?.description,
            })),
          });
        } catch (error) {
          console.error({ error });
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [activePageNum]);

  const updateTab = async (index: number): Promise<void> => {
    setActivePageNum(index);
    userData.navigation.push(index);
  };

  const getUserToken = (): string =>
    new URLSearchParams(window.location.search).get("token") || "";

  const isActivePage = (pageInd: number) => pageInd + 1 === activePageNum;

  const apiCall = async (token: string): Promise<ResponseBody> => {
    const reqBody: { token: string; navigation?: number[] } = {
      token,
      navigation: userData.navigation,
    };

    const resp = await axios.post(GET_USER_API, reqBody, {
      headers: {
        "x-api-key": "a0wZN5SgZ15B8lP5YIgWT2OcM59bm7He5glddaQc",
      },
    });
    const body = JSON.parse(resp.data?.body || "{}");

    return {
      ...body,
      ...JSON.parse(body?.items || "[]"),
    };
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

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
        <p className="welcome-msg">Welcome, {userData.name}!</p>
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
          <div className="body-content">
            <Iframe {...userData.iframes[activePageNum - 1]} />
          </div>
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
function Iframe({ url, title }: { url: string; title: string }) {
  const iframe = `
    <iframe
        height="100%"
        width="100%"
        title=${title}
        src=${url}
    />
  `;
  return (
    <div
      style={{ width: "100%", height: "100%" }}
      dangerouslySetInnerHTML={{ __html: iframe }}
    ></div>
  );
}
