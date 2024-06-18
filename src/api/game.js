import request from '@/utils/request'

const game = {
  announcement: '/api/v1/user/announcement',
  games: '/api/v1/user/games',
  workorder: '/api/v1/user/workorder'
}

export function getAnnouncement (parameter) {
  return request({
    url: game.announcement,
    method: 'get',
    params: parameter
  })
}

export function getGames(parameter) {
  return request({
    url: game.games,
    method: 'get',
    params: parameter
  })
}

export function postWorkOrder (data) {
  return request({
    url: game.workorder,
    method: 'post',
    data: data
  })
}
