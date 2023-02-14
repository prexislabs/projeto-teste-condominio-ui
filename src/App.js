import React, { lazy, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { themeChange } from "theme-change";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, goerli, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet } from "wagmi/chains";

import ethimg from "./images/ethIcon.png";

// Importing pages
const Layout = lazy(() => import("./containers/Layout"));

// Rainbowkit

const { chains, provider } = configureChains(
  [process.env.REACT_APP_NETWORK == "mainnet" ? mainnet : goerli],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Condominio UI",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const CustomAvatar = ({ address, ensImage, size }) => {
  const color = getRandomColor();
  return ensImage ? (
    <img
      src={ensImage}
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
      alt=""
    />
  ) : (
    <div
      style={{
        backgroundColor: color,
        borderRadius: 999,
        height: size,
        width: size,
      }}
    ></div>
  );
};

function App() {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <>
      <Router>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            chains={chains}
            modalSize="compact"
            avatar={CustomAvatar}
          >
            <Routes>
              <Route path="/app/*" element={<Layout />} />
              <Route
                path="*"
                element={<Navigate to="/app/morador" replace />}
              />
            </Routes>
          </RainbowKitProvider>
        </WagmiConfig>
      </Router>
    </>
  );
}

export default App;
