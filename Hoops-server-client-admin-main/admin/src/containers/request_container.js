import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Input,
  Space, 
  DatePicker,
} from "antd";
import moment from 'moment';

import {
  addUser,
  deleteRequest,
  disApproveRequest,
  fetchRequests,
  requestApprove,
  blockRequest,
  unBlockRequest
} from "../actions/request";
import {  SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

import { ShowModalHook }from "../components/selectDate/selectDate";

import { AudioOutlined } from '@ant-design/icons';

//search box
// const { Search } = Input;

// const suffix = (
//   <AudioOutlined
//     style={{
//       fontSize: 16,
//       color: '#1890ff',

//     }}
//   />
// );

// const onSearch = value => console.log(value);
//end

class RequestContainer extends Component {
  
  constructor(props) {
    super(props);
    this.props.dispatch(fetchRequests());
    this.state = {
      items: false,
      visible: false,
      data: null,
      searchText: "",
      searchedColumn: "",
      load: false,
      translated: "",
      translatedFrom: "",
      loading: false,
      isModalVisible: false,
      isAntdVisible: false,
      address: "",
      unixDate: 0,  //++ added
      errors: {
        address: "",
      },
    };
  }


  componentDidUpdate(prevProps, prevState) {
    const props = this.props;
    if (this.props.requestList !== prevProps.requestList) {
      if (props.requestList.requests) {
        if (props.requestList.requests.success === true) {
          window.location.reload();
        }
        if (props.requestList.requests.success === false) {
          alert("Not approved Something went wrong");
          window.location.reload();
        }
        if (props.requestList.addUser) {
          if (props.requestList.addUser.success) {
            window.location.reload();
            this.handleModalHide();
          } else {
            this.setState({ errors: { address: props.requestList.addUser.msg } });
          }
        }
        if (props.requestList.deleteUser) {
          if (props.requestList.deleteUser.success) {
            window.location.reload();
          } else {
            alert(props.requestList.deleteUser.msg);
            window.location.reload();
          }
        }
        if (props.requestList.disApproveRequest) {
          if (props.requestList.disApproveRequest.success) {
            window.location.reload();
          } else {
            alert(props.requestList.disApproveRequest.msg);
            window.location.reload();
          }
        }
      }
    }
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      return (
        record[dataIndex] &&
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      );
    },

    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text && text.toString()}
        />
      ) : (
        text
      ),
  });

  

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };


  handleModalShow = () => {
    this.setState({
      isModalVisible: true,
      address: ""
    });
  };

  handleModalHide = () => {
    this.setState({ isModalVisible: false, errors: { address: "" }, address: "" });
  };

  handleAdd = (e) => {
    if (!this.isValid()) return;
    this.props.dispatch(addUser(this.state.address));
  };

  isValid = () => {
    let errors = {};
    if (this.state.address === "") {
      errors.address = "Address is required";
    }
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  onAddressChange = (e) => {
    this.setState({ address: e.target.value });
  };


  handleRequestStatus = (record) => {
    if (record.approve) {
      this.props.dispatch(disApproveRequest(record.address));
    } else {
      this.setState({
        isAntdVisible: true,
    
      });
      this.setState({address: record.address});

      // this.props.dispatch(requestApprove(record.address)); //added , this.state.date //on Ok button
      // console.log("----record date :  ", record.address);
      // window.location.reload();   +added
    }
  };

  //Block Request Handle
  handleBlockRequest = (record) => {
    if (record.isBlocked) {
      this.props.dispatch(unBlockRequest(record.address));
      window.location.reload();

  } else {
    this.props.dispatch(blockRequest(record.address))
    window.location.reload();

  }
}
  //

  //MintModal function

  handleOk = (date, dateString, record) => {
    console.log(this.state.address, this.state.unixDate);
    // console.log("record on Handle OK: ", record);
    // if (!this.isDateValid()) return;
    // this.props.dispatch(requestApprove(this.state.date));
    this.props.dispatch(requestApprove(this.state.address, this.state.unixDate));  //added
    //on Ok button getting unix timestamp of selected date 
    // console.log(date, dateString);
    // console.log("----------date : ", date._d);

    // const tillDateMint = moment(date._d).format('YYYY.MM.DD');
    // console.log("-----moment Formate: ", tillDateMint)

    // const convertToUnixOnOk = parseInt((new Date(tillDateMint).getTime() / 1000).toFixed(0))
    // console.log("----unixTimestamp On OK: ", convertToUnixOnOk);
// 
    // console.log("---set 008 Unix Date: ", unixDate);


    this.setState({
      isAntdVisible: false,
    });
  
  };

  handleCancel = () => {
    this.setState({ isAntdVisible: false, errors: { date: "" }, date: "" });
  };

 onDateChange = (date, dateString) => {
    // console.log(date, dateString);
    // console.log("----------date : ", date._d);
    const tillDateMint = moment(date._d).format('YYYY.MM.DD');
    // console.log("-----moment Formate: ", tillDateMint)
    //normal date to unix time stamp
    const convertToUnix = parseInt((new Date(tillDateMint).getTime() / 1000).toFixed(0))
    console.log("----unixTimestamp----", convertToUnix);   //getting exact after selecting date in unix
    this.setState({unixDate: convertToUnix})  
    // console.log("---set 008 Unix Date: ", unixDate);
   
  }

  //disable dates
  disabledDate = (current) => {
    let customDate = new Date().toLocaleDateString();
    // console.log("custom date: ", customDate);
    return current && current < moment(customDate, "MM-DD-YYYY");
    // return current && current < moment().endOf('day');   // including current day disable

  }
  //



  isDateValid = () => {
    let errors = {};
    if (this.state.date === "") {
      errors.date = "Date is required";
    }
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  //end


  render() {
    const list = this.props.requestList.requests;
    const isModalVisible = this.state.isModalVisible;
    const isAntdVisible = this.state.isAntdVisible;

    if (!list) {
      return <div className="loader">Loader</div>;
    }
    if(this.state.loading){
      return <div className="loader">Loader</div>;
    }

        const columns = [
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        render: (text) => <span>{text}</span>,
      },
      {
        title: "Approved",
        dataIndex: "approve",
        key: "approve",
        render: (text) => <span style={{backgroundColor:'yellow'}}>{text ? "Yes" : "No"}</span>,
      },
      {
        title: "Date",
        dataIndex: "unixDate",
        key: "unixDate",
        render: (text) => {console.log("text", text)
        const date = moment( new Date(text * 1000)).format("MMMM Do YYYY");  return <>{date}</>}
      },
      {
        title: "Remaining",
        dataIndex: "counter",
        key: "counter",
        render: (text) => <span>{10-text}</span>,
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <>
            <Button onClick={() => this.handleRequestStatus(record)} type="Primary">{record.approve ? "Disapprove" : "Allow"}</Button>
            <Button style={{ marginLeft: 10 }} onClick={() => this.props.dispatch(deleteRequest(record.address))} type="primary" danger>Delete</Button>
            <Button style={{ marginLeft: 10 }} onClick={() => this.handleBlockRequest(record)} type="primary" danger>{record.isBlocked ? "Unblock" : "Block"}</Button>

          </>
        ),
      },
    ];

  
    return (
      <div className="right-section">
      <div style={{display: "flex", alignItems:"center"}}>
       <div>
       <Button
          onClick={this.handleModalShow}
          style={{ marginTop: 10, marginBottom: 10 }}
        >
          Add User
        </Button>

       </div>
       {/* <div>
        <Search style={{width:"140%"}} placeholder="input search text" onSearch={this.handleSearch} enterButton />

       </div> */}
      </div>

        <Table
          columns={columns}
          pagination={{ pageSize: 10 }}   //pagignation 10 
          rowKey="_id"
          dataSource={list.requests && list.requests}
        />
        <Modal
          title="Add User"
          visible={isModalVisible}
          okText="Add"
          onOk={this.handleAdd}
          onCancel={this.handleModalHide}
        >
          <Input placeholder="Address" value={this.state.address} onChange={this.onAddressChange} />
          <div style={{ color: 'red', fontSize: 12, marginTop: 10 }}>{this.state.errors.address}</div>
        </Modal>
        
        {/* <ShowModalHook isAntdVisible={this.state.isAntdVisible} close={(val)=>  this.setState({ isAntdVisible: val })} date={(val)=>  this.setState({ date: val })}/> */}

        <Modal
          title="Mint-Date"
          visible={isAntdVisible}
          okText="OK"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
    <DatePicker onChange={this.onDateChange} disabledDate={this.disabledDate} style={{ width: '80%',
    cursor: "pointer" }}/>
  </Space>
  <div style={{ color: 'red', fontSize: 12, marginTop: 10 }}>{this.state.errors.date}</div>
        </Modal>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    requestList: state.request,
  };
}
export default connect(mapStateToProps)(RequestContainer);
