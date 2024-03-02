import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Drawer,
  Space,
  Popconfirm,
  message
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router';

import Layout from '../components/Layout'
import CreateUser from "./CreateUser";
import axios from "axios";
import { ElearningAxios } from ".";
// import '../pages/assets/scss/main.scss'
const posts = () => {
  const [opened, setOpened] = useState("");
  const [courses, setCourses] = useState([]);
  console.log(courses,"courses")
  const [editData, setEditdata] = useState({});
const router = useRouter();

  useEffect(() => {
    fetch(ElearningAxios+'/api/courses')
      .then((response) => response.json())
      .then((data) => { 
  console.log(data,"coursesdata")
        
        setCourses(data?.data) })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  const closeModal = () => {
    setOpened(false);
  }

  const handleEdit = (value) => {
    setOpened("edit");
    setEditdata(value)
  }

  const handleformDelete=(value)=>{
    axios.delete(ElearningAxios+`/api/courses/${value}`).then((res)=>{
      
      message.success('Product delete successfully');
      router.reload();
  }).catch((err)=>{
      message.error('Error in delete')
  })
  }
  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Showroom Name',
      dataIndex: 'title',

      sorter: (a, b) => {
        const nameA = a?.title?.toLowerCase();
        const nameB = b?.title?.toLowerCase();
        return nameA?.localeCompare(nameB);
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Minimum Price',
      dataIndex: 'price',
    },
    {
      title: 'Showroom Description',
      dataIndex: 'description',
    },
    {
      title: 'Showroom Logo',
      render: (value) => {
        return (
          <img src={value?.images} width={30} height={30}/>

        )
      }

    },
    {
      title: 'Showroom Category',
      render: (value) => {
        return (
          <p>{value?.category?.categorytitle}</p>

        )
      }
    },
    {
      title: 'Showroom Owner',
      dataIndex: 'author',
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="large">
          {/* edit button */}
          <Button
            // type="primary"
            icon={<EditOutlined />}
            size="medium"
            onClick={() => handleEdit(record)}
          />
          {/* delete button */}
          <Popconfirm
            title="Are you sure want delete the data"
            onConfirm={() => handleformDelete(record._id)}
            okType='default'
            style={{color:"black",borderColor:"black"}}
          >
            <Button style={{color:"black",borderColor:"black"}}  icon={<DeleteOutlined />} size="medium" />
          </Popconfirm>


        </Space>
      ),
    },

  ];
  return (
    <Layout>
      <div style={{ color: "black" }}>

        <div className='container-fluid' >
          <div className='create_user'>
            <h1>Showroom Details</h1>
            <Button
              className="add_user"
              icon={<PlusOutlined />}
              onClick={() => setOpened("create")}
            >
              Create New Showroom
            </Button>
          </div>
          <Table columns={columns} dataSource={courses} />
          {/* form open */}
          <Drawer
            className="drawer_sec"
            placement="right"
            open={opened?.length > 1 ? true : false}
            closable={false}
            onClose={() => setOpened(false)}
            title={
              <div className="create_user_sec">
               
                {opened === "create" ? <h2>Create Showroom</h2> : <></>}
                {opened === "edit" ? <h2>Edit Showroom</h2> : <></>}

              </div>
            }
            width="700px"
          >
            {opened === "create" ? (
              <>
                <CreateUser editData={null} closeModal={closeModal} />
              </>
            ) : (
              <></>
            )}

            {opened === "edit" ? (
              <>
                <CreateUser editData={editData} closeModal={closeModal} />
              </>
            ) : (
              <></>
            )}



          </Drawer>
        </div>
      </div>
    </Layout>
  )
}

export default posts