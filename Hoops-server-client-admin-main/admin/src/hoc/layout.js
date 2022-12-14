import React from "react";
import PageHeader from "../components/header/header";

import { Layout } from "antd";

const { Footer } = Layout;

class PageLayout extends React.Component {
  render() {
    return (
      <>
          <>
            <PageHeader />
            <Layout>
              <Layout>
                {this.props.children}
                <Footer style={{ textAlign: "center" }}>
                  Copyright Ⓒ 2020. All rights reserved by ADMIN.
                </Footer>
              </Layout>
            </Layout>
          </>
      </>
    );
  }
}

export default PageLayout;
