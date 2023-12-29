import React, { useEffect, useState, useContext } from 'react';
import { Space, Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios'
import { CountContext } from '../App';
import langCn from './langCn';
import langEn from './langEn';

const host = 'http://localhost:3001/tag'

interface DataType {
  id: string;
  name: string;
}

type FieldType = {
  name: string;
};

interface FieldData {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

const TagPage: React.FC = () => {

  const [tableData, setTableData] = useState([] as DataType[])
  const [currentId, setCurrentId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fields, setFields] = useState<FieldData[]>([{ name: ['name'], value: '' }]);
  const { lang } = useContext(CountContext);

  const getLang = (key: string) => {
    const l = lang === 'en' ? langEn : langCn
    return l.tag[key]
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
  }, [])

  const fetchList = () => {
    axios.get(`${host}/list`).then(({ data }) => {
      setTableData(data.data)
    })
  }

  const handleEditOrCreate = (row: any) => {
    if (row) {
      setCurrentId(row.id)
      setFields([
        { name: ['name'], value: row.name },
      ]);
    } else {
      setCurrentId('')
      setFields([
        { name: ['name'], value: '' },
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
      axios.put(`${host}/edit`, {
        id: currentId,
        name: values.name
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
      axios.post(`${host}/add`, values).then(({ data }: any) => {
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

  return (
    <div>
      <Button type='primary' style={{ marginBottom: 8 }} onClick={() => { handleEditOrCreate(null) }}>{getLang('create')}</Button>
      <Table pagination={false} rowKey="id" columns={columns} dataSource={tableData} />

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

export default TagPage;
