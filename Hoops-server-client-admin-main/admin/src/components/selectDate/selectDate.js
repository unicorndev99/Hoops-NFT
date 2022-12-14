import React, { useEffect, useState } from 'react';
import { Modal, Button, Space, DatePicker } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import { requestApprove } from '../../actions/request';


export const ShowModalHook = ({isAntdVisible,close,date}) => {
  const [isModalVisible, setIsModalVisible] = useState(isAntdVisible);
  console.log("!----- isantd: ------",isAntdVisible,isModalVisible)

  const [mintDatetime, setMintDatetime] = useState("")



  const handleOk = () => {
    setIsModalVisible(false);
    //Date Format
    const tillDateMint = moment(mintDatetime).format('YYYY.MM.DD');
    console.log("-----moment Formate: ", tillDateMint);

  //normal date to unix time stamp
    
    const convertToUnix = parseInt((new Date(tillDateMint).getTime() / 1000).toFixed(0))
    console.log("----unixTimestamp----", convertToUnix);
    date(convertToUnix)


  // set unixTimestamp locally,
    // localStorage.setItem('convertToUnix', JSON.stringify(convertToUnix));  //always set with the button ID may be in Model backend  

    // const getItemFromLocal = JSON.parse(localStorage.getItem('convertToUnix'));

    // console.log("----unixTimeStamp Local: ", getItemFromLocal);
    close(false)
    // this.props.dispatch(requestApprove(record.address));

  };

  const handleCancel = () => {
    setIsModalVisible(false);
    close(false)
  };

//Datepicker

  function onChange(date, dateString) {
    console.log(date, dateString);
    console.log(date._d);
    setMintDatetime(date._d)
  }

  

  return (
    <>
      {/* <Button className='modal-fix' type="primary" onClick={showModal}>
        Allow
      </Button> */}
      <Modal title="MINT Date" visible={isAntdVisible} onOk={handleOk} onCancel={handleCancel}>
        <Space direction="vertical" style={{ width: '100%' }}>
    <DatePicker onChange={onChange} style={{ width: '80%',
    cursor: "pointer" }}/>
  </Space>
      </Modal>
    </>
  );
};

// ReactDOM.render(<App />, mountNode);
