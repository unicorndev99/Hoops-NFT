import React from "react";
import {
  UserOutlined,
  ReadOutlined,
  NotificationOutlined,
  EuroOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";

import { Menu, Layout } from "antd";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;
const { Sider } = Layout;

class PageSidebar extends React.Component {
  render() {
    return (
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          // defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <SubMenu
            key="sub1"
            title={
              <span>
                <UserOutlined className="sidebar-icon" />
                Users
              </span>
            }
          >
            <Menu.Item key="1">
              <Link to="/admin">View users</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <ReadOutlined className="sidebar-icon" />
                Requests
              </span>
            }
          >
            <Menu.Item key="2">
              <Link to="/admin/list_users">View Requests</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub3"
            title={
              <span>
                <NotificationOutlined className="sidebar-icon" />
                Feedbacks
              </span>
            }
          >
            <Menu.Item key="3">
              <Link to="/admin/feedbacks">View feedbacks</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub4"
            title={
              <span>
                <EuroOutlined className="sidebar-icon" />
                Payment Setting
              </span>
            }
          >
            <Menu.Item key="4">
              <Link to="/admin/paymentSetting">View/Set Payment</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub5"
            title={
              <span>
                <DownloadOutlined className="sidebar-icon" />
                Withdrawal
              </span>
            }
          >
            <Menu.Item key="5">
              <Link to="/admin/transactions">Transactions</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  return {
    login: state.user.login,
  };
}

export default connect(mapStateToProps)(PageSidebar);
