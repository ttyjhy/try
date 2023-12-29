import React, { useEffect, useState, useContext } from 'react';
import { Space, Table, Button, Modal, Form, Input, message, Popconfirm, Tag, Select, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios'
import dayjs from 'dayjs';
import langCn from './langCn';
import langEn from './langEn';
import { CountContext } from '../App';

const host = 'http://localhost:3001/data'
const colorList = ["red", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"]

interface DataType {
  id: string;
  name: string;
  desc: string;
  createTime: string;
  showTime: string;
  tags: string;
}

type FieldType = {
  name: string;
  desc: string;
  tags: string;
};

interface FieldData {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

const DataPage: React.FC = () => {

  const [tableData, setTableData] = useState([] as DataType[])
  const [tags, setTags] = useState([])
  const [currentId, setCurrentId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fields, setFields] = useState<FieldData[]>([{ name: ['name'], value: '' }]);
  const { lang } = useContext(CountContext);

  const getLang = (key: string) => {
    const l = lang === 'en' ? langEn : langCn
    return l.data[key]
  }

  const columns: ColumnsType<DataType> = [
    {
      title: getLang('id'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: getLang('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: getLang('desc'),
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: getLang('createTime'),
      dataIndex: 'showTime',
      key: 'showTime',
    },
    {
      title: getLang('tag'),
      dataIndex: 'tags',
      key: 'tags',
      render: (row, record) => {
        return row.map((item: any, index: number) => {
          let i = index % colorList.length;
          return <Tag bordered={false} color={colorList[i]} key={item}>{item}</Tag>
        })
      }
    },
    {
      title: getLang('action'),
      key: 'action',
      render: (row, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => { handleEditOrCreate(row) }}>
            {getLang('edit')}
          </Button>
          <Popconfirm
            title={getLang('delete')}
            description={getLang('confirmDel')}
            onConfirm={() => {
              confirm(row.id)
            }}
            onCancel={cancel}
            okText={getLang('delete')}
            cancelText={getLang('cancel')}
          >
            <Button danger type="text">
              {getLang('delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchList();
    fetchTagsList();
  }, [])

  const fetchList = () => {
    axios.get(`${host}/list`).then(({ data }) => {
      setTableData(data.data.map((item: DataType) => {
        return {
          ...item,
          showTime: dayjs(item.createTime).format('YYYY/MM/DD')
        }
      }))
    })
  }

  const fetchTagsList = () => {
    axios.get(`http://localhost:3001/tag/list`).then(({ data }) => {
      setTags(data.data.map((item: any) => {
        return { label: item.name, value: item.name }
      }))
    })
  }

  const handleEditOrCreate = (row: any) => {
    if (row) {
      setCurrentId(row.id)
      setFields([
        { name: ['name'], value: row.name },
        { name: ['desc'], value: row.desc },
        { name: ['tags'], value: row.tags },
      ]);
    } else {
      setCurrentId('')
      setFields([
        { name: ['name'], value: '' },
        { name: ['desc'], value: '' },
        { name: ['tags'], value: [] },
      ]);
    }
    showModal();
  }

  const showModal = () => {
    setIsModalOpen(true);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    handleCancel()

    if (currentId) {
      const target = tableData.find(item => item.id === currentId)
      axios.put(`${host}/edit`, {
        id: currentId,
        name: values.name,
        desc: values.desc || '',
        tags: values.tags || [],
        createTime: target?.createTime
      }).then(({ data }: any) => {
        if (data.code === 200) {
          fetchList()
          message.success(data.message)
        } else {
          message.error(data.message)
        }
      })
      setCurrentId('')
    } else {
      axios.post(`${host}/add`, {
        name: values.name,
        desc: values.desc || '',
        tags: values.tags || [],
        createTime: +new Date()
      }).then(({ data }: any) => {
        if (data.code === 200) {
          fetchList()
          message.success(data.message)
        } else {
          message.error(data.message)
        }
      })
    }
  };

  const confirm = (id: string) => {
    axios.delete(`${host}/delete?id=${id}`).then(({ data }: any) => {
      if (data.code === 200) {
        fetchList()
        message.success(data.message)
      } else {
        message.error(data.message)
      }
    })
  };

  const cancel = () => { };

  const onSearch = (values: any) => {
    let list = tableData
    if (values.name) {
      list = tableData.filter(item => item.name.includes(values.name))
    }

    if (values.tags) {
      list = tableData.filter(item => item.tags.includes(values.tags))
    }

    if (values.createTime) {
      console.log(values.createTime.format('YYYY/MM/DD'))
      list = tableData.filter(item => item.showTime === values.createTime.format('YYYY/MM/DD'))
    }

    setTableData(list)

    if (!values.name && !values.tags && !values.createTime) {
      fetchList();
    }

  }

  const reset = () => {
    window.location.reload();
  }

  return (
    <div>
      <Form
        name="basic"
        onFinish={onSearch}
        autoComplete="off"
        layout='inline'
        style={{ marginBottom: 16 }}
      >
        <Form.Item<FieldType>
          label={getLang('name')}
          name="name"
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label={getLang('tags')}
          name="tags"
        >
          <Input />
        </Form.Item>
        <Form.Item label={getLang('createTime')} name="createTime">
          <DatePicker placeholder=''></DatePicker>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            {getLang('submit')}
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button onClick={reset}>
            {getLang('reset')}
          </Button>
        </Form.Item>
      </Form>

      <Button type='primary' style={{ marginBottom: 8 }} onClick={() => { handleEditOrCreate(null) }}>{getLang('create')}</Button>
      <Table rowKey="id" columns={columns} dataSource={tableData} />

      <Modal title={getLang('tips')} footer={null} open={isModalOpen} onCancel={handleCancel}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          fields={fields}
        >
          <Form.Item<FieldType>
            label={getLang('name')}
            name="name"
            rules={[{ required: true, message: getLang('input') + getLang('name') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label={getLang('desc')}
            name="desc"
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label={getLang('tags')}
            name="tags"
          >
            <Select
              mode="multiple"
              style={{ width: 120 }}
              options={tags}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {getLang('submit')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DataPage;
