import request from '@/utils/request'

export function getMessageApi(){
  return request({
    url: `/api/message/admin/getMessage`,
    method: 'get',
  })
}
