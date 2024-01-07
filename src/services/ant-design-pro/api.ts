// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

// /** 获取当前的用户 GET /api/currentUser */
// export async function currentUser(options?: { [key: string]: any }) {
//   return request<{
//     data: API.CurrentUser;
//   }>('/api/currentUser', {
//     method: 'GET',
//     ...(options || {}),
//   });
// }

// /** 退出登录接口 POST /api/login/outLogin */
// export async function outLogin(options?: { [key: string]: any }) {
//   return request<Record<string, any>>('/api/login/outLogin', {
//     method: 'POST',
//     ...(options || {}),
//   });
// }

// /** 登录接口 POST /api/login/account */
// export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
//   return request<API.LoginResult>('/api/login/account', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data: body,
//     ...(options || {}),
//   });
// }

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /GetProjectAllData */
export async function GetProjectAllData(params: any, sort: any) {
  return request<API.RuleList>('http://127.0.0.1:4000/GetProjectAllData', {
    method: 'GET',
    params: {
      ...params,
      sort: { ...(sort || {}) },
    },
    //...(sort || {}),
  });
}

/** 更新规则 PUT /updateProject */
export async function updateProject(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('http://127.0.0.1:4000/updateProject', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /addProject */
export async function addProject(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('http://127.0.0.1:4000/addProject', {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /deleteProject */
export async function deleteProject(options?: { [key: string]: any }) {
  return request<Record<string, any>>('http://127.0.0.1:4000/deleteProject', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
