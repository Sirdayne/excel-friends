import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    userLoading: true,
  },
  getters: {
    getUserLoading: (state) => {
      return state.userLoading;
    }
  },
  mutations: {
    setUserLoading: (state, payload) => {
      state.userLoading = payload;
    }
  },
  actions: {
    actionSetUserLoading: ({commit}, payload) => {
      commit('setUserLoading', payload);
    }
  },
  modules: {

  }
});
