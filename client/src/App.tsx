import React, { useEffect, createContext, useState } from 'react';
import { BookOutlined, TagOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import {
  HashRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import DataPage from './pages/data'
import TagPage from './pages/tag'
import axios from 'axios';

export const CountContext = createContext({} as any);

const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const [lang, setLang] = useState('en');

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleClickMenu = ({ key }: any) => {
    if (key === 'dataPage') {
      window.location.href = '/#/'
    } else if (key === 'tagPage') {
      window.location.href = '/#/tag'
    }
  }

  useEffect(() => {
    fetchLang();
  }, [])

  const fetchLang = () => {
    axios.get('http://localhost:3001/lang/list').then(({ data }: any) => {
      if (data.code === 200) {
        setLang(data.data)
      }
    })
  }

  const switchLang = () => {
    axios.put('http://localhost:3001/lang/edit', { lang: lang === 'en' ? 'cn' : 'en' }).then(({ data }: any) => {
      setLang(lang === 'en' ? 'cn' : 'en')
    })
  }

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#fff', display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 24 }}>{lang === 'cn' ? '数据管理平台' : 'Data management platform'}</div>
          <div style={{ fontSize: 16, cursor: 'pointer' }} onClick={switchLang}>中/En</div>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['dataPage']}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              {
                key: 'dataPage',
                icon: React.createElement(BookOutlined),
                label: lang === 'cn' ? `数据管理` : 'Data management',
              },
              {
                key: 'tagPage',
                icon: React.createElement(TagOutlined),
                label: lang === 'cn' ? `标签管理` : 'Tag management',

              }
            ]}
            onClick={handleClickMenu}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 800,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <CountContext.Provider value={{ lang, setLang }}>
              <Router>
                <Routes>
                  <Route path="/" element={<DataPage />} />
                  <Route path="/tag" element={<TagPage />} />
                </Routes>
              </Router>
            </CountContext.Provider>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
