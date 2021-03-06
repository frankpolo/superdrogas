import http from '@/utilities/http'
import template from '@/utilities/template'

const state = {
  users: [],
  user: {},
  roles: [
    { id: 'AD', text: 'Administrator' },
    { id: 'SL', text: 'Seller' }
  ],
  errors: {},
  isLoading: false
}

const getters = {
  isNewUser: state => state.user.id === undefined,
  users: state => {
    var users = []
    state.users.forEach(user => {
      if (user.rol !== 'CM') {
        users.push(user)
      }
    })
    return users
  },
  customers: state => {
    var customers = []
    state.users.forEach(customer => {
      if (customer.rol === 'CM') {
        customers.push(customer)
      }
    })
    return customers
  }
}

const mutations = {
  SET_USERS: (state, newUsers) => {
    state.users = newUsers
  },
  SET_USER: (state, newUser) => {
    state.users = [
      ...state.users.filter(user => user.id !== newUser.id),
      newUser
    ]
  },
  SET_ERRORS: (state, newErrors) => {
    state.errors = newErrors || {}
  },
  ADD_USER: (state, newUser) => {
    state.users.unshift(newUser)
  },
  GET_USER: (state, userId) => {
    state.user = state.users.find(user => user.id === userId) || {}
  },
  SWITCH_USER_STATUS: state => {
    state.users.forEach((user, index) => {
      if (user.id === state.user.id) {
        state.users[index].is_active = !state.users[index].is_active
      }
    })
  },
  SET_LOAD_STATUS: (state, newLoadStatus) => {
    state.isLoading = newLoadStatus
  },
  SET_USERNAME: (state, newUsername) => {
    state.user = { ...state.user, username: newUsername }
  },
  SET_ROL: (state, newRol) => {
    state.user = { ...state.user, rol: newRol }
  },
  SET_EMAIL: (state, newEmail) => {
    state.user = { ...state.user, email: newEmail }
  },
  SET_FIRST_NAME: (state, newFirstName) => {
    state.user = { ...state.user, first_name: newFirstName }
  },
  SET_LAST_NAME: (state, newLastName) => {
    state.user = { ...state.user, last_name: newLastName }
  },
  SET_PHONE: (state, newPhone) => {
    state.user = { ...state.user, phone: newPhone }
  },
  SET_ADDRESS: (state, newAddress) => {
    state.user = { ...state.user, address: newAddress }
  },
  SET_IDENTIFICATION_NUMBER: (state, newIdentificationNumber) => {
    state.user = { ...state.user, identification_number: newIdentificationNumber }
  },
  SET_PASSWORD: (state, newPassword) => {
    state.user = { ...state.user, password: newPassword }
  },
  SET_PASSWORD_CONFIRMATION: (state, newPasswordConfirmation) => {
    state.user = { ...state.user, password_confirmation: newPasswordConfirmation }
  }
}

const actions = {
  getUsers: async ({ commit }) => {
    commit('SET_LOAD_STATUS', true)
    const response = await http.get('accounts/users/')
    if (!response.error) {
      commit('SET_USERS', response.data)
    }
    commit('SET_LOAD_STATUS', false)
  },
  getUser: ({ commit }, userId) => {
    commit('SET_ERRORS')
    commit('GET_USER', userId)
  },
  createUser: async ({ state, commit }, event) => {
    if (event) event.preventDefault()
    commit('SET_ERRORS')
    const response = await http.post('accounts/users/', state.user)
    if (!response.error) {
      template.destroy()
      commit('ADD_USER', response.data)
      template.hideModal('#user-form')
      commit('GET_USER')
    } else {
      commit('SET_ERRORS', response.data)
    }
  },
  updateUser: async ({ state, commit }, event) => {
    if (event) event.preventDefault()
    commit('SET_ERRORS')
    const response = await http.patch(`accounts/users/${state.user.id}/`, state.user)
    if (!response.error) {
      template.destroy()
      commit('SET_USER', response.data)
      template.hideModal('#user-form')
    } else {
      commit('SET_ERRORS', response.data)
    }
  },
  deleteUser: async ({ state, commit }) => {
    const response = await http.delete(`accounts/users/${state.user.id}/`)
    if (!response.error) {
      commit('SWITCH_USER_STATUS')
      template.hideModal('#user-status')
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
