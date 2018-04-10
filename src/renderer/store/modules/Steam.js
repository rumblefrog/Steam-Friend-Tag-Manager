const state = {
  friends: {},
  tags: {},
  tagsMap: {}
};

const mutations = {
  updateFriends(state, friends) {
    state.friends = friends;
  },
  updateTags(state, tags) {
    state.tags = tags;

    Object.keys(tags).forEach((key) => {
      tags[key].members.forEach((member) => {
        if (Object.prototype.hasOwnProperty.call(state.tagsMap, member.getSteamID64())) {
          state.tagsMap[member.getSteamID64()].push(tags[key].name);
        } else {
          state.tagsMap[member.getSteamID64()] = [tags[key].name];
        }
      });
    });
  }
};

const actions = {
  updateFriends({ commit }, friends) {
    commit("updateFriends", friends);
  },
  updateTags({ commit }, tags) {
    commit("updateTags", tags);
  }
};

export default {
  state,
  mutations,
  actions,
};
