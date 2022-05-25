import request from '@/utils/request'

export function login(userPhone,userPassword,userType) {
  return request({
    url: '/api/user/login',
    method: 'post',
    params: {userPhone,userPassword,userType}
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}

export function getUserPageApi(current,size,data){
  return request({
    url: `/api/user/getUserPage/${current}/${size}`,
    method: 'post',
    data
  });
}

export function deleteUser(userId) {
  return request({
    url: '/api/user/deleteUser',
    method: 'delete',
    params: { userId }
  })
}

export function resetUserPasswordApi(userId,password) {
  return request({
    url: '/api/user/resetUserPassword',
    method: 'post',
    params: { userId,password}
  })
}

export function getPersonComplainListApi(personId) {
  return request({
    url: '/api/person/getPersonComplainList',
    method: 'get',
    params: { personId}
  })
}

