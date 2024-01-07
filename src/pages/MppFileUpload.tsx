import { UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form, Input, Upload, UploadFile, message, theme } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import React, { useState } from 'react';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};
const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [projectname, setProjectname] = useState('');
  const handleUpload = async () => {
    // \/:*?"<>|
    let searchn = projectname.search(/[\/:*?"<>|]/);
    if (searchn != -1) {
      message.error('Please enter the project name correctly');
      return;
    }
    if (!projectname) {
      message.error('Please enter the project name');
      return;
    }
    const formData = new FormData();
    formData.append('projectname', projectname);
    fileList.forEach((file) => {
      formData.append('files[]', file as RcFile);
    });
    setUploading(true);
    // You can use any AJAX library you like
    await fetch('http://127.0.0.1:4000/MppFileUpload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((json) => {
        setFileList([]);
        if (json.uploaded) message.success('Upload successfully.');
        else message.error(json.error);
      })
      .catch(() => {
        message.error('Upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
  };
  const handleUpdate = async () => {
    setUpdating(true);
    await fetch('http://127.0.0.1:4000/UpdateSQL', {
      method: 'POST',
    })
      .then((res) => {
        res.json();
      })
      .then((json) => {
        message.success('Update successfully.');
        console.log(json);
      })
      .catch((error) => {
        message.error('Update failed.');
        console.log(error);
      })
      .finally(() => setUpdating(false));
  };
  const props: UploadProps = {
    onRemove: (file: UploadFile<any>) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: UploadFile<any>, fileList) => {
      setFileList([...fileList]);
      return false;
    },
    fileList,
  };

  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage: 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          ></p>
          <div
            style={{
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <Form
              labelCol={{ span: 4 }}
              layout="vertical"
              autoComplete="off"
              action="http://127.0.0.1:4000/UploadSubmit"
              method="POST"
            >
              <Form.Item<FieldType>
                label="Project Name"
                name="projectname"
                rules={[{ required: true, message: 'Please input project name!' }]}
              >
                <Input
                  onChange={(e) => {
                    setProjectname(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Upload {...props} directory>
                  <Button icon={<UploadOutlined />}>Select Folder</Button>
                </Upload>
                <Button
                  type="primary"
                  onClick={handleUpload}
                  disabled={fileList.length === 0}
                  loading={uploading}
                  style={{ marginTop: 16 }}
                >
                  {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleUpdate} loading={updating}>
                  {updating ? 'Updating' : 'Update ProjectFiles'}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};
export default Welcome;
