import React, {useState} from 'react';
import './index.css';
import {DatePicker, message, Button, ConfigProvider} from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
const App:React.FC<{}>= ()=>{
    const [date, setDate] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const handleChange = (value) => {
        messageApi.info(`您选择的日期是: ${value ? value.format('YYYY年MM月DD日') : '未选择'}`);
        setDate(value);
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#00b96b',
                },
            }}
        >
            <div style={{ width: 400, margin: '100px auto' }}>
                <Button type="primary" icon={<PoweroffOutlined /> }>hello</Button>
                <DatePicker onChange={handleChange} />
                <div style={{ marginTop: 16 }}>
                    当前日期：{date ? date.format('YYYY年MM月DD日') : '未选择'}
                </div>
            </div>
            {contextHolder}
        </ConfigProvider>

    );
}
export default App;