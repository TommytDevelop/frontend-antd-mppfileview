import {
  GetProjectAllData,
  addProject,
  deleteProject,
  updateProject,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';

const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('Loading');
  try {
    await addProject({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateProject(fields);
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const handleRemove = async (selectedRow: API.RuleListItem) => {
  const hide = message.loading('Loading');
  if (!selectedRow) return true;
  try {
    await deleteProject(selectedRow);
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();

  const intl = useIntl();

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: <FormattedMessage id="BatchName" defaultMessage="BatchName" />,
      dataIndex: 'batch_name',
      tip: 'The batch name is the unique key',
      editable: false,
      sorter: true,
    },
    {
      title: <FormattedMessage id="ProjectName" defaultMessage="ProjectName" />,
      dataIndex: 'project_name',
      editable: false,
      sorter: true,
    },
    {
      title: <FormattedMessage id="TaskName" defaultMessage="TaskName" />,
      dataIndex: 'task_name',
      sorter: true,
    },
    {
      title: <FormattedMessage id="TaskType" defaultMessage="TaskType" />,
      dataIndex: 'task_type',
      valueEnum: {
        0: 'FIXED_UNITS',
        1: 'FIXED_DURATIONS',
        2: 'FIXED_WORK',
        3: 'FIXED_DURATION_AND_UNITS',
      },
      sorter: true,
    },
    {
      title: <FormattedMessage id="Duration_Days" defaultMessage="Duration_Days" />,
      dataIndex: 'duration_days',
      sorter: true,
    },
    {
      title: <FormattedMessage id="Start_Date" defaultMessage="Start_Date" />,
      sorter: true,
      dataIndex: 'start_date',
      valueType: 'date',
    },
    {
      title: <FormattedMessage id="Start_Date" defaultMessage="End_Date" />,
      sorter: true,
      dataIndex: 'end_date',
      valueType: 'date',
    },
    {
      title: <FormattedMessage id="Predecesor" defaultMessage="Predecesor" />,
      dataIndex: 'predecessor',
      valueType: 'digit',

      sorter: true,
    },
    {
      title: <FormattedMessage id="Level" defaultMessage="Level" />,
      dataIndex: 'level',
      valueType: 'digit',
      sorter: true,
    },
    {
      title: <FormattedMessage id="Notes" defaultMessage="Notes" />,
      dataIndex: 'notes',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="Operating" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',

      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record._id);
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="Edit" />
        </a>,
        <a
          key="delete"
          onClick={() => {
            handleDeleteModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.subscribeAlert" defaultMessage="Delete" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'MppFileView',
          defaultMessage: 'MppFileView',
        })}
        editable={{
          type: 'single',
          editableKeys,
          onDelete: async (key, record) => {
            await handleRemove(record);
            console.log(record);
          },
          onSave: async (key, record) => {
            handleUpdate(record);
            console.log(record);
          },
          onChange: setEditableRowKeys,
        }}
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="New" defaultMessage="New" />
          </Button>,
        ]}
        request={GetProjectAllData}
        columns={columns}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'New Project',
          defaultMessage: 'New Project',
        })}
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="project_name"
            label="Project Name"
            required
            rules={[{ required: true, message: 'Please enter project name!' }]}
            tooltip="Project Name is required"
            placeholder="Project Name"
          />
          <ProFormText
            width="md"
            name="task_name"
            label="Task Name"
            required
            rules={[{ required: true, message: 'Please enter task name!' }]}
            tooltip="Task Name is required"
            placeholder="Task Name"
          />
          <ProFormSelect
            width="md"
            name="task_type"
            label="Task Type"
            required
            valueEnum={{
              0: 'FIXED_UNITS',
              1: 'FIXED_DURATIONS',
              2: 'FIXED_WORK',
              3: 'FIXED_DURATION_AND_UNITS',
            }}
            //rules={[{ required: true, message: 'Please enter task type!' }]}
            tooltip="Task Type is required"
            placeholder="Task Type"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            name="duration_days"
            width="md"
            label="Duration days"
            required
            rules={[{ required: true, message: 'Please enter duration days!', type: 'number' }]}
            tooltip="Duration days is required"
            placeholder="Duration days"
          />
          <ProFormDatePicker
            name="start_date"
            tooltip="Start Date is required"
            required
            rules={[{ required: true, message: 'Please enter start date!', type: 'date' }]}
            label="Start Date"
          />
          <ProFormDatePicker
            name="end_date"
            tooltip="End Date is required"
            required
            rules={[{ required: true, message: 'Please enter end date!', type: 'date' }]}
            label="End  Date"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            name="predecessor"
            width="md"
            label="Predecessor"
            placeholder="Predecessor"
          />
          <ProFormDigit
            name="level"
            width="md"
            label="Level"
            required
            rules={[{ required: true, message: 'Please enter level!', type: 'number' }]}
            tooltip="Level is required"
            placeholder="Level"
          />
        </ProForm.Group>
        <ProFormTextArea name="notes" label="Notes" />
      </ModalForm>

      <ModalForm
        title={intl.formatMessage({
          id: 'Delete Project',
          defaultMessage: 'Delete Project',
        })}
        open={deleteModalOpen}
        modalProps={{}}
        onOpenChange={handleDeleteModalOpen}
        onFinish={async (value) => {
          const success = await handleRemove(currentRow as API.RuleListItem);
          if (success) {
            handleDeleteModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <h2>Do you want to delete,really?</h2>
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
