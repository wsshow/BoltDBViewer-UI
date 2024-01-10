import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button, Modal, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { reqDelete, reqSet } from '../api';

const BoltTable = (props) => {
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    setDataSource(props.dataSource);
  }, [props.dataSource]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    reqSet({ db_path: props.dbPath, bucket: props.bucketName, key: title, value: value }).then((response) => response.json())
      .then((data) => {
        if (data.code === 0) {
          console.log("Success:", data);
          setDataSource(dataSource.map(item => {
            if (item.key === title) {
              item.value = value
            }
            return item
          }))
          messageApi.success(`${title}修改成功`);
          setIsModalOpen(false);
        }else{
          messageApi.error(`${title}修改失败, 原因: ${data.desc}`);
        }
      })
      .catch((error) => {
        messageApi.error(`${title}修改失败`);
        console.error("Error:", error);
      });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const columns = [
    {
      title: '键',
      dataIndex: 'key',
      key: 'key',
      width: 100,
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      render: (text) => (<TextArea value={text} autoSize readOnly />),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: ({ key, value }) => (
        <Space size="middle">
          <Button onClick={() => {
            setTitle(key)
            setValue(value)
            showModal()
          }} style={{ borderColor: 'green', color: 'green' }}>修改</Button>
          <Button onClick={() => {
            reqDelete({ db_path: props.dbPath, bucket: props.bucketName, key }).then((response) => response.json())
              .then((data) => {
                if (data.code === 0) {
                  console.log("Success:", data);
                  messageApi.success(`${key}删除成功`);
                  setDataSource(dataSource.filter(item => item.key !== key))
                }else{
                  messageApi.error(`${key}删除失败, 原因: ${data.desc}`);
                }
              })
              .catch((error) => {
                messageApi.error(`${key}删除失败`);
                console.error("Error:", error);
              });
          }} danger>删除</Button>
        </Space>
      ),
    },
  ];
  return <>
    {contextHolder}
    <Modal title={title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="保存" cancelText="取消">
      <TextArea value={value} onChange={e => setValue(e.target.value)} autoSize />
    </Modal>
    <Table columns={columns} dataSource={dataSource} pagination={{ showTotal: (total, range) => `共 ${total} 条数据` }} />
  </>
};
export default BoltTable;