import { Form, Input, Button, message, InputNumber,Select ,Upload} from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import uploadimage from '../pages/assets/Image/uploadimage.png'
import Image from 'next/image';

import { useRouter } from 'next/router';
import { ElearningAxios } from '.';
const CreateProduct = ({ closeModal, editData }) => {
    const [form] = Form.useForm();
const router = useRouter();
const [urlList, setUrlList] = useState([]);
console.log(urlList, "urlList")
const [oneImage, setOneImage] = useState("0");
const [courses, setCourses] = useState([]);

const { Dragger } = Upload;
    // edit form open

    useEffect(() => {
        fetch(ElearningAxios+'/api/courses')
            .then((response) => response.json())
            .then((data) => { setCourses(data?.data) })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);
    useEffect(() => {
        if (editData) {
            let userObject = JSON.parse(JSON.stringify(editData));
            form.setFieldsValue(userObject);
        }
    }, [editData])

    const uploadImages = async (options) => {
        const { onSuccess, onError, file } = options;


        try {
            {
                const data = new FormData();

                data.append("file", file);
                data.append("upload_preset", "Pockets_Projects");
                data.append("cloud_name", "ds5q63dpl");
                fetch(`https://api.cloudinary.com/v1_1/ds5q63dpl/image/upload`, {

                    method: "post",
                    body: data,
                })
                    .then((resp) => resp.json())
                    .then((data) => {
                        setUrlList((urlList) => [...urlList, data.url]);
                        setOneImage('1');

                    })
                    .catch((err) => {
                    });
                onSuccess("Ok");
            }
        } catch (err) {
            // onError({ err });
        }
    };
    // get data from localstorage
   

    // create  actions
    useEffect(() => {
        if (editData) {
            let userObject = JSON.parse(JSON.stringify(editData));
            userObject.CarShowroom = userObject?.CarShowroom?.title;
            setUrlList(userObject?.carImages?.split(","));
            form.setFieldsValue(userObject);
        }
    }, [editData])
  
    const ImageUploaderProp = {
        name: "file",
        multiple: true,
        action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
        onChange(info) {
            const { status } = info.file;
            if (status !== "uploading") {
            }

        },
        onDrop(e) {
        },
    };

    // onfinish action
    const handleCreate = (value) => {
        value.carImages = urlList[0].toString()

        if(editData){
            axios.put(ElearningAxios+`/api/Productdetails/${editData?._id}`,value).then((res)=>{
                closeModal(null);
                message.success('Productdetails edit successfully');
                router.reload();
            }).catch((err)=>{
                message.error('Error in edit form')
            })
        }else{
            axios.post(ElearningAxios+`/api/Productdetails/`,value).then((res)=>{
                closeModal(null);
                message.success('Productdetails Created successfully')
                router.reload();
            }).catch((err)=>{
                message.error('Error in create form')
            })
        }

    }

    return (
        <div className='create_form_user'>
            <Form form={form} layout="vertical" onFinish={handleCreate}>


                <Form.Item name='carName' label={<p className='create_User_lable'>Product Name</p>}
                    required={false} rules={[{ required: true, message: "Please enter your carName" }]}
                >
                    <Input className="input_height" placeholder="Type your carName" autoComplete="off" />
                </Form.Item>

                <Form.Item name='carPrice' label={<p className='create_User_lable'>Product Price</p>}
                    required={false} rules={[{ required: true, message: "Please enter your carPrice" }]}

                >
                    <Input className="input_height" placeholder="Type your carPrice" autoComplete="off" />
                </Form.Item>

                <Form.Item name='contactNo' label={<p className='create_User_lable'>Contact No</p>}
                    required={false} rules={[{ required: true, message: "Please enter your carPrice" }]}

                >
                    <Input type='number' className="input_height" placeholder="Type your carPrice" autoComplete="off" />
                </Form.Item>

                <Form.Item name='carDescription' label={<p className='create_User_lable'>Product Description</p>}
                    required={false} rules={[{ required: true, message: "Please enter your carDescription" }]}

                >
                    <Input className="input_height" placeholder="Type your carDescription" autoComplete="off" />
                </Form.Item>

                <Form.Item name='Location' label={<p className='create_User_lable'>Product Location</p>}
                    required={false} rules={[{ required: true, message: "Please enter your Location" }]}

                >
                    <Input className="input_height" placeholder="Type your Location" autoComplete="off" />
                </Form.Item>

                <Form.Item
                    // className="list_content"
                    label={<p className='create_User_lable'>Showroom</p>}
                    name="CarShowroom"
                    required={false} rules={[{ required: true, message: "Please enter your CarShowroom" }]}
                >
                    <Select className="input_height">
                        {courses?.map(
                            (item) => (
                                (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item?.title}
                                    </Select.Option>
                                )
                            )
                        )}
                    </Select>

                   
                </Form.Item>


                <Form.Item
                        style={{ marginTop: "20px" }}
                        label="Upload Thumbnail Photo"
                        className="label_font"

                    // required={false} rules={[{ required: true, message: "Please  Upload your thumbnail photo" }]}
                    >
                        <Dragger
                            {...ImageUploaderProp}
                            name="file"
                            disabled={urlList?.length === 1 ? true : false}
                            showUploadList={false}
                            customRequest={uploadImages}
                            style={oneImage === '1' ? { cursor: "not-allowed", pointerEvents: "none" } : { cursor: "pointer", pointerEvents: "auto" }}
                            // beforeUpload={handleBeforeUpload}
                            accept="image/png, image/jpeg"
                            className="dragger_image"
                        >
                            <p className="ant-upload-drag-icon">
                                <Image
                                    style={{ display: "initial" }}
                                    alt="image"
                                    src={uploadimage}
                                />
                            </p>
                            <p>
                                Drag & Drop or <span className="browse_upload">Browse</span>
                            </p>
                            <p className="ant-upload-text">
                                <span className="upload_content">
                                    Photo formates: JPEG, PNG, (maximum image size 2 mb).
                                </span>
                            </p>
                        </Dragger>

                    </Form.Item>

                    {urlList?.length === 0 ? (<></>) : (
                        <div className="dev_sec">
                            {
                                <div className="image_delete_design">
                                    <div className="photo_sec">
                                        <div className="photo">
                                            <img src={urlList[0]} alt="delete" width={30} height={30} style={{ borderRadius: "5px" }} />
                                        </div>
                                        {/* <p className="size">(Size: 1.3 MB)</p> */}
                                    </div>
                                    <span className="border_left"></span>

                                </div>
                            }

                        </div>)}

                <Form.Item name='owner' label={<p className='create_User_lable'>Product Owner</p>}
                    required={false} rules={[{ required: true, message: "Please enter your owner" }]}

                >
                    <Input className="input_height" placeholder="Type your owner" autoComplete="off" />
                </Form.Item>
                <div className='create_flex'>

                    <Button className='cancel_bttn' onClick={() => closeModal(null)}>Cancel</Button>


                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='create_bttn'>{editData?.id ? "Edit" : "Create"} Productdetails</Button>
                    </Form.Item>
                </div>

            </Form>
        </div>
    )
}

export default CreateProduct