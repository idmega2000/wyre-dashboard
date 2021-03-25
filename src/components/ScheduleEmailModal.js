import React, { useContext, useEffect, useState} from 'react';

import {
  Modal,
  Row,
  Col,
  Menu,
  Checkbox,
  Input
} from 'antd';

import axios from 'axios'

import CompleteDataContext from '../Context';
import ScheduleEmailBtn from '../icons/ScheduleEmailBtn';


import dataHttpServices from '../services/devices';

import { Hr } from '../icons/Hr';

import { ModalBtns } from '../smallComponents/ModalBtns'
import { ModalDropdownBtn } from '../smallComponents/ModalDropdownBtn'

import  { useFetchScheduleEmailData, usePostScheduleEmailData} from '../helpers/FetchScheduleEmailData'

export const ScheduleEmailModal = () => {
  const { isModalVisible, setIsModalVisible, token, userId, allDevices, checkedDevices  } = useContext(
    CompleteDataContext
  );

  const [emailModalData, setEmailModalData] = useState([])
  const [addEmail, setAddEmail] = useState('')
  const [sendBill, setSendBill] = useState('')
  const [ExternalRecieverAvailableDevices,setExternalRecieverAvailableDevices ] = useState([])
  const [frequencyDropdown, setFrequencyDropdown] = useState([])
  const [personalDataAvailableDevices, setPersonalDataAvailableDevices] = useState([])

  const fetchedModalData = []
  
  const dateRange = dataHttpServices.endpointDateRange;

  const getemailModalDataUrl = `https://wyreng.xyz/api/v1/mail_schedules_data/${userId}/`;
  const addNewExternalReceiverUrl = `https://wyreng.xyz/api/v1/add_external_bill_reciever/${userId}/` 
  const addavailableDevicesToBillReceiver = `https://wyreng.xyz/api/v1/add_assigned_devices/${userId}/`
  const deleteBillReceiverUrl = `https://wyreng.xyz/api/v1/delete_mail_reciever/${userId}/`
  const sendBillUrl = `https://wyreng.xyz/api/v1/send_report/${userId}/${dateRange}`

  // useFetchScheduleEmailData(getemailModalDataUrl, setEmailModalData)

  const getData =  () =>{        
           axios.get(getemailModalDataUrl, {
              headers: {
                Authorization: `bearer ${token}`,
              },
            })
            .then((resp) => {
              const parsedData = resp.data.data;
              setEmailModalData(parsedData)
              fetchedModalData.push(emailModalData)
            })
            .catch((error) => console.log('An error occured:', error));
          }

    useEffect(() => {
          getData()
            }, [getemailModalDataUrl, addNewExternalReceiverUrl,deleteBillReceiverUrl, sendBillUrl])

  const ShowModal = () => { 
    // const { data: {personal_data: {assigned_devices: {id}}} } = 
    console.log(fetchedModalData)
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFrequencyMenuClick = (e) => {
    setFrequencyDropdown(e.item.props.children[1])
    console.log(frequencyDropdown)
  };

  const handleDevicesMenuClick = (v)=>{
    setExternalRecieverAvailableDevices(v.key)
    console.log('Devices selected', ExternalRecieverAvailableDevices)
  }

  const handlePersonalDataDevicesMenuClick = (Devices)=>{
    setPersonalDataAvailableDevices(Devices.key)
    console.log('Devices selected', personalDataAvailableDevices)
  }

  //  const personalDataDevices = [fetchedModalData].forEach((assignedDevices) => {
  //     // return [assignedDevices.personal_data].map((getDevices) =>{
  //       [assignedDevices.assigned_devices].map((device) =>(  
  //       <Menu onClick={handleDevicesMenuClick} selectedkeys={[ ExternalRecieverAvailableDevices ]}>
  //         <Menu.Item key= { device.device_id}>
  //           {device.device_name}
  //           <Checkbox style={{marginLeft:"20px"}}/>
  //         </Menu.Item> 
  //       </Menu>
  //       ))
  //     // })
  // })


  // const {data:{available_devices} } = emailModalData
  //   console.log(available_devices)

  const AvailableDevicesDropdownList =(
    <React.Fragment>
      {/* {allDevices.map(device => { */}
      <Menu onClick={handlePersonalDataDevicesMenuClick} selectedkeys={[ personalDataAvailableDevices ]}>
          <Menu.Item key= '1'>  
            {/* {device.name} */} device
            <Checkbox style={{marginLeft:"20px"}}/>
          </Menu.Item>
        </Menu>
      
    </React.Fragment>
  )

  const frequencyDropDownList = (
    <Menu onClick={handleFrequencyMenuClick} selectedKeys={[ frequencyDropdown ]}>
      <Menu.Item key="1" >WEEKLY</Menu.Item>
      <Menu.Item key="2">BI-WEEKLY</Menu.Item>
      <Menu.Item key="3">MONTHLY</Menu.Item>
    </Menu>
  );
  
  const handleChangForAddExternalReceiever = (e) =>{
      let externalReceiver = e.target.value;
      setAddEmail(externalReceiver)
  }

  const AddExternalReceiver = (e) =>{
      e.preventDefault();
      let addExternalReceiverData = JSON.stringify({
        "email": addEmail
      })

      axios.post(addNewExternalReceiverUrl, addExternalReceiverData,{
        headers:{
                'Content-Type': 'application/json',
                Authorization: `bearer ${token}`,
        },
        validateStatus: (status) => {
        return true;
      },
      })
      .then((response) => {
        console.log(response.data)
        setEmailModalData(response.data)
      })
      .catch(err => console.log("Couldn't add external Reciever", err))
  }

  let selectedDevicesIds = []

  for (const prop in checkedDevices) {
      let listOfDeviceId = allDevices.filter((e) => {
        return e.name === prop;
      });
      selectedDevicesIds.push(listOfDeviceId[0].id);
    }    

   const handleChangeForSendAQuickBill = (event) =>{ 
      let targetEmail = event.target.value;
      setSendBill(targetEmail)
   }

   const submitEmailTargetForSendAQuickBill = (event) => {
     event.preventDefault();
    let sendAQuickBiillData = JSON.stringify({
      'email': sendBill, 
      'selected_devices': selectedDevicesIds})

    console.log('Quick Bill data', sendAQuickBiillData)

    axios.post(sendBillUrl, sendAQuickBiillData, {
      headers : { 'Content-Type': 'application/json',
                   Authorization: `bearer ${token}`},
    })
    .then((res) => {
      console.log('Successfully sent data to server:', res)
    })
    .catch(error => console.log('Error posting data', error))
   }


   const deleteBillReceiver = () =>{
     let deleteBillReceiverdata = JSON.stringify({
       'reciever_id ' : '',
       selected_devices: selectedDevicesIds
      })

      axios.post(deleteBillReceiverUrl, deleteBillReceiverdata, {
        headers:{
                'Content-Type': 'application/json',
                Authorization: `bearer ${token}`,
        }
      })
      .then(res =>{
        console.log(res)
        setEmailModalData(res)
      })
      .catch(error => console.log('Error deleting and posting data:', error))
   }
  // Styles
  const emailStyles = {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    color: '#000000',
  };

  const rowStyles = {
       marginBottom: '50px', 
       marginTop: '30px' 
  }

  const addEmailInputBox = {
    marginLeft: '200px',
  };

  const ModalHeaders = {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '24px',
    color: '#000000',
  };
   
  return (
    <>
      <button type="button" className="print-button" onClick={ShowModal} >
        <ScheduleEmailBtn />
      </button>
      {fetchedModalData.length >= 0 ? [fetchedModalData].map((datas)=> (
      <Modal
        visible={isModalVisible}
        style={{ top: 20 }}
        footer= {null}
        onCancel={handleCancel}
      >
        <Row justify="center">
          <Col>
            <p style={ModalHeaders}> External Reciever </p>
          </Col>
        </Row>
        <Hr/>
        <br/>
        { datas.external_recievers > 0 ?
          
        <Row key={1}>
          <Col span={10} style={emailStyles}>
            {datas.data.external_recievers.email}
            display@email.com
          </Col>
          <Col span={10}>
            <ModalDropdownBtn dropDownList= {AvailableDevicesDropdownList}  text="Assigned Devices"/>
          </Col>
          <Col span={4}>
            <ModalBtns action="delete" onClick={deleteBillReceiver}/>
          </Col>
        </Row>
       : <Row justify="center"><Col><p>No External Receiver added</p></Col></Row> }
        <br />
        <Hr />

        <Row style={rowStyles}>
          <Col style={addEmailInputBox} span={8}>
            <Input placeholder="Add email" value={addEmail} onChange={handleChangForAddExternalReceiever}/>
          </Col>
          <Col span={4} style={{ marginLeft: '30px' }}>
              <ModalBtns action="add" onClick={AddExternalReceiver} />
          </Col>
        </Row>
        <br />
        <Row justify="center">
          <Col>
            <p style={ModalHeaders}>Personal Mail Frequency</p>
          </Col>
        </Row>
        <Hr />
        <Row
          justify="center"
          style={rowStyles}
        >
          <Col span={12}>
              <ModalDropdownBtn  text="Assigned Devices" />
          </Col>
          <Col>
            <ModalDropdownBtn dropDownList={frequencyDropDownList} text="Frequency"/>
          </Col>
        </Row>
        <Row justify="center">
          <Col>
            <p style={ModalHeaders}>Send A Quick Bill</p>
          </Col>
        </Row>
        <Hr />
        <Row justify="center" style={rowStyles}>
          <Col span={12} style={{marginRight:"20px"}}>
            <Input placeholder="Enter email address" value={sendBill} onChange={handleChangeForSendAQuickBill}/>
          </Col>
          <Col>
            <ModalBtns action="send" onClick={submitEmailTargetForSendAQuickBill}/>
          </Col>
        </Row>
      </Modal>
       )): console.log('An error Ocurred try again') }
      </>
  );
};
