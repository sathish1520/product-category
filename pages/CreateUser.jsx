import { Form, Input, Button, message, InputNumber, Select, Upload } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Image from 'next/image';
import uploadimage from '../pages/assets/Image/uploadimage.png'
import { ElearningAxios } from '.';
const CreateUser = ({ closeModal, editData }) => {
    const [form] = Form.useForm();
    const [category, setCategory] = useState([]);
    const [urlList, setUrlList] = useState([]);
    console.log(urlList, "urlList")
    const [oneImage, setOneImage] = useState("0");

    const { Dragger } = Upload;

    const router = useRouter();
    useEffect(() => {
        fetch('https://product-details.onrender.com/api/category')
            .then((response) => response.json())
            .then((data) => { setCategory(data?.data) })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);
    // edit form open
    useEffect(() => {
        if (editData) {
            let userObject = JSON.parse(JSON.stringify(editData));
            userObject.category = userObject?.category?.categorytitle;
            setUrlList(userObject.images.split(","));
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
    // get data from localstorage


    // create  actions

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



    // onfinish action
    const handleCreate = (value) => {
        value.images = urlList[0].toString()
        if (editData) {
            axios.put(ElearningAxios+`/api/courses/${editData?._id}`, value).then((res) => {
                closeModal(null);
                message.success('Product edit successfully');
                router.reload();
            }).catch((err) => {
                message.error('Error in edit form')
            })
        } else {
            axios.post(ElearningAxios+`/api/courses`, value).then((res) => {
                closeModal(null);
                message.success('Product Created successfully')
                router.reload();
            }).catch((err) => {
                message.error('Error in create form')
            })
        }

    }

    return (
        <div className='create_form_user'>
            <Form form={form} layout="vertical" onFinish={handleCreate}>


                <Form.Item name='title' label={<p className='create_User_lable'>Showroom Name</p>}
                    required={false} rules={[{ required: true, message: "Please enter  Showroom Name" }]}
                >
                    <Input className="input_height" placeholder="Type  Showroom Name" autoComplete="off" />
                </Form.Item>

                <Form.Item name='description' label={<p className='create_User_lable'>Showroom Description</p>}
                    required={false} rules={[{ required: true, message: "Please enter  Showroom description" }]}

                >
                    <Input className="input_height" placeholder="Type  Showroom description" autoComplete="off" />
                </Form.Item>

                <Form.Item name='price' label={<p className='create_User_lable'>Minimum Price</p>}
                    required={false} rules={[{ required: true, message: "Please enter  Minimum Price" }]}


                >
                    <InputNumber className="input_height" placeholder="Minimum Price" autoComplete="off" />
                </Form.Item>

                <Form.Item name='author' label={<p className='create_User_lable'>Showroom Owner</p>}
                    required={false} rules={[{ required: true, message: "Please enter  Showroom Owner" }]}

                >
                    <Input maxLength={10} className="input_height" placeholder="Showroom Owner Name" autoComplete="off" />
                </Form.Item>


                <Form.Item
                    // className="list_content"
                    label={<p className='create_User_lable'>Showroom Category</p>}
                    name="category"
                    required={false} rules={[{ required: true, message: "Please enter your Showroom category" }]}
                >
                    <Select className="input_height">
                        {category?.map(
                            (item) => (
                                (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item?.categorytitle}
                                    </Select.Option>
                                )
                            )
                        )}
                    </Select>

                   
                </Form.Item>
                <Form.Item
                        style={{ marginTop: "20px" }}
                        label="Showroom Logo"
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

                    {urlList.length === 0 ? (<></>) : (
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
                <div className='create_flex'>

                    <Button className='cancel_bttn' onClick={() => closeModal(null)}>Cancel</Button>


                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='create_bttn'>{editData?.id ? "Edit" : "Create"} Showroom</Button>
                    </Form.Item>
                </div>

            </Form>
        </div>
    )
}

export default CreateUser