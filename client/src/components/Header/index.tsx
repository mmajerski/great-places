import { useState, useEffect } from "react";
import { Layout, Button, Menu, Input } from "antd";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { Viewer } from "../../utils/types";
import { SIGN_OUT } from "../../graphql/mutations";
import { SignOut } from "../../graphql/mutations/__generated__/SignOut";
import {
  errorNotification,
  successNotification
} from "../../utils/NotificationComponent";

const { Header } = Layout;
const { Item, SubMenu } = Menu;
const { Search } = Input;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const HeaderComponent = withRouter(
  ({ viewer, setViewer, history, location }: Props & RouteComponentProps) => {
    const [search, setSearch] = useState("");

    const [signOut] = useMutation<SignOut>(SIGN_OUT, {
      onCompleted: (data) => {
        if (data && data.signOut) {
          setViewer(data.signOut);
          sessionStorage.removeItem("token");
          successNotification("Sign Out Successfully!");
        }
      },
      onError: () => {
        errorNotification("Error during signing out. Please try again");
      }
    });

    useEffect(() => {
      const { pathname } = location;
      const pathnameSub = pathname.split("/");

      if (!pathname.includes("/cities")) {
        setSearch("");
        return;
      }

      if (pathname.includes("/cities") && pathnameSub.length === 3) {
        setSearch(pathnameSub[2]);
        return;
      }
    }, [location]);

    const handleSignOut = () => {
      signOut();
    };

    const subMenu = viewer.id ? (
      <SubMenu title={viewer.email}>
        <Item key="/user">
          <Link to={`/user/${viewer.id}`}>Profile</Link>
        </Item>
        <Item key="/signout" onClick={handleSignOut}>
          Sign Out
        </Item>
      </SubMenu>
    ) : (
      <Item>
        <Button>
          <Link to="/signin">Sign In</Link>
        </Button>
      </Item>
    );

    const onSearch = (value: string) => {
      const trimmedValue = value.trim();

      if (trimmedValue) {
        history.push(`/cities/${trimmedValue}`);
      } else {
        errorNotification("Please enter a valid city");
      }
    };

    return (
      <Header
        style={{
          display: "flex",
          background: "#fff",
          boxShadow: "0 2px 8px #f0f1f2",
          padding: 0
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Link to="/">Home</Link>
        </div>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            marginRight: "40px"
          }}
        >
          <Search
            placeholder="Search for city"
            enterButton
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={onSearch}
          />
        </div>
        <Menu mode="horizontal" selectable={false}>
          <Item key="/organizer">
            <Link to="/organizer">Organizer</Link>
          </Item>
          {subMenu}
        </Menu>
      </Header>
    );
  }
);

export default HeaderComponent;
