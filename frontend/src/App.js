import "./App.css";
import React from "react";
import ZotForm from "./components/zotform";
import { render } from "@testing-library/react";

const App = () => {
  const image = (
    <img
      src="https://zotmatch-assets.s3.amazonaws.com/logo.png"
      style={{ width: "50%", height: "50%" }}
    />
  );
  return (
    <div>
      <div class="row">
        <div class="column side">
          {/*
          <div class="row">
            <img
              src="https://nakedsecurity.sophos.com/wp-content/uploads/sites/2/2017/01/mongodb.png?w=775"
              style={{ width: "75%", height: "75%" }}
            />
          </div>
          <div class="row">
            <img
              src="https://coryrylan.com/assets/images/posts/types/react.svg"
              style={{ width: "30%", height: "30%" }}
            />
          </div>
          <img
            src="https://images.squarespace-cdn.com/content/v1/51814c87e4b0c1fda9c1fc50/1528473310893-RH0HG7R5C0QURMFQJBSU/ke17ZwdGBToddI8pDm48kOyctPanBqSdf7WQMpY1FsRZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpyD4IQ_uEhoqbBUjTJFcqKvko9JlUzuVmtjr1UPhOA5qkTLSJODyitRxw8OQt1oetw/600px-AWS_Lambda_logo.svg.png?format=500w"
            style={{ width: "30%", height: "30%" }}
          />
          */}
        </div>

        <div class="column middle">
          <div class="box">
            {image}
            <h1>ZotMatch 💙 💛</h1>
            <p class="desc">
              hi there! we built this app to help anteaters find love or
              friendship during quarantine. enter the full names of 3 uci
              students you'd like to get to know better, and if they like you
              back you'll be matched via email! good luck and shoot your zot! 🥺
            </p>
            <ZotForm />
          </div>
        </div>
      </div>
      <div class="footer">
        Made with ❤️ in Irvine, CA |{" "}
        <a href="https://zotmatch-assets.s3.amazonaws.com/about.html">About</a>
        {" | "}
        <a href="https://zotmatch-assets.s3.amazonaws.com/privacy.html">
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default App;
