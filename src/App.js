import React, { useState } from 'react';
import { Button, Form, Space, Card, Select } from 'antd';
import BoltTable from './comps/BoltTable';
import { reqClose, reqConnect, reqDataFromBucket } from './api'

const dbPathOptions = [
  { value: 'jt.db', label: 'jt.db' },]

const App = () => {
  const [isConn, setIsConn] = useState(false);
  const [selectData, setSelectData] = useState([])
  const [selectValue, setSelectValue] = useState()
  const [inputValue, setInputValue] = useState()
  const [tableData, setTableData] = useState([])
  const [form] = Form.useForm();
  const dbPathSlectOnChange = (value) => {
    console.log("dbPathSlectOnChange:", value);
    if (value.length === 0) return
    setInputValue(value[0])
  };
  const apiDataFromBucket = (bucketName) => {
    const param = {
      'db_path': inputValue,
      'bucket': bucketName
    }
    reqDataFromBucket(param).then((response) => response.json())
      .then((data) => {
        if (data.code === 0) {
          const tData = []
          for (let key in data.data) {
            const d = JSON.parse(data.data[key]);
            tData.push({
              key: key,
              value: JSON.stringify(d,null, 4)
            })
          }
          setTableData(tData)
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  const slectOnChange = (value) => {
    console.log('select:', value);
    if (!isConn) {
      return
    }
    apiDataFromBucket(value)
  };
  const selectOnSearch = (value) => {
    console.log('search:', value);
  };
  const slectFilterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  return (
    <Space direction={'vertical'} style={{ width: '100%' }}>
      <Card>
        <Form
          layout={'inline'}
          form={form}
          initialValues={{
            layout: 'inline',
          }}
          style={{
            maxWidth: 'none'
          }}
        >
          <Form.Item label="数据库地址">
            <Select
              mode="tags"
              style={{ width: 200 }}
              placeholder="例如: D://test//test.db"
              onChange={dbPathSlectOnChange}
              options={dbPathOptions}
              disabled={isConn}
            />
          </Form.Item>
          <Form.Item label="表名称">
            <Select
              showSearch
              value={selectValue}
              style={{ width: 200 }}
              optionFilterProp="children"
              onChange={slectOnChange}
              onSearch={selectOnSearch}
              filterOption={slectFilterOption}
              options={selectData}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" danger={isConn} onClick={() => {
              const param = {
                'db_path': inputValue
              }
              if (isConn) {
                reqClose(param).then((response) => response.json())
                  .then((data) => {
                    if (data.code === 0) {
                      console.log("Success:", data);
                      setIsConn(!isConn);
                    }
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              } else {
                reqConnect(param).then((response) => response.json())
                  .then((data) => {
                    if (data.code === 0) {
                      console.log("Success:", data);
                      setIsConn(!isConn);
                      const options = []
                      data.data.forEach(el => {
                        options.push({ label: el, value: el })
                      });
                      setSelectData(options)
                      if (options.length > 0) {
                        setSelectValue(options[0].value)
                        apiDataFromBucket(options[0].value)
                      }
                    }
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              }
            }}>{isConn ? '关闭连接' : ' 连接数据库'}</Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <BoltTable dataSource={tableData} dbPath={inputValue} bucketName={selectValue}/>
      </Card>
    </Space>
  );
};
export default App;